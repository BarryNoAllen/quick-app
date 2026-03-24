#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 获取当前环境
const NODE_ENV = process.env.NODE_ENV || 'development'
console.log(`Building for environment: ${NODE_ENV}`)

// 环境配置
const envConfig = {
  development: {
    version: require('../package.json').version,
    env: 'development',
    debug: true,
    showVersion: true
  },
  test: {
    version: require('../package.json').version,
    env: 'test',
    debug: false,
    showVersion: true
  },
  production: {
    version: require('../package.json').version,
    env: 'production',
    debug: false,
    showVersion: false
  }
}

// 生成配置文件
const configPath = path.join(__dirname, '../src/config')
const envFilePath = path.join(configPath, 'build-env.js')

if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath, { recursive: true })
}

const content = `// Auto-generated environment configuration file
// This file is generated during build process

const envConfig = ${JSON.stringify(envConfig[NODE_ENV], null, 2)}

export default envConfig
`

fs.writeFileSync(envFilePath, content)
console.log(`✓ Environment config generated: ${envFilePath}`)
console.log(`✓ Config: ${JSON.stringify(envConfig[NODE_ENV])}`)
