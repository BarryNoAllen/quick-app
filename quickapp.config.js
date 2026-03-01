const path = require('path')
const webpack = require('webpack')

module.exports = {
  cli: {
    enableE2e: true
  },
  webpack: {
    // 1. 【配置别名】
    // 这里定义的别名，可以在 JS 中直接使用，配合 Less Loader 配置后也可在 Less 中使用
    resolve: {
      extensions: ['.ux', '.js', '.json'], // 建议补充默认扩展名
      alias: {
        '&': path.resolve(__dirname, 'src'), // 保留你原有的 & 别名
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@styles': path.resolve(__dirname, 'src/assets/styles')
      }
    },
    
    module: {
      rules: [
        // --- 新增：专门处理 .less 文件的规则 ---
        {
          test: /\.less$/,
          use: [
            // 注意：hap-toolkit 内部可能已经注入了 style-loader 和 css-loader
            // 我们只需要追加或修改 less-loader 的配置
            // 如果构建报错说 loader 重复，可能需要调整顺序或只配置 options
            {
              loader: 'less-loader',
              options: {
                // --- 核心功能 A: 全局自动注入变量 ---
                // less-loader v5 使用 data 选项（v7+ 才支持 additionalData）
                // 使用 '~' 开头告诉 less-loader 去 webpack resolve.alias 中查找
                data: `@import '~@styles/variables.less';`,

                // --- 核心功能 B: 让 Less 识别别名 ---
                // 指定 less 编译器查找 import 文件的目录
                paths: [
                  path.resolve(__dirname, 'src'),
                  path.resolve(__dirname, 'src/assets'),
                  path.resolve(__dirname, 'src/assets/styles')
                ]
              }
            }
          ]
        },

        // 保留你原有的图片处理规则
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        }
      ]
    },
    
    plugins: [
      // 保留你原有的插件
      new webpack.DefinePlugin({
        ENV_TYPE: JSON.stringify(process.env.type || 'dev') // 建议加上 JSON.stringify 确保类型正确
      })
    ]
  }
}

