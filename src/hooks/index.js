/**
 * 应用配置 1060+
 * 接口声明: 无需声明
 */

import configuration from "@system.configuration";

const RTL_LANG = ["ar"];

/**
 * 系统配置监听 Hook
 * 用于处理快应用中系统配置变化的事件
 * @param {Object} event 配置变化事件对象
 * @param {Object} options 配置选项及回调函数
 */
export const useConfiguration = (event, options = {}) => {
  const { type } = event;
  const {
    onThemeModeChange,
    onLanguageChange,
    onConfigurationChanged,
  } = options;

  // 触发通用配置变化回调
  if (typeof onConfigurationChanged === 'function') {
    onConfigurationChanged(event);
  }

  try {
    switch (type) {
      case "themeMode": {
        // 检查是否支持主题模式API
        if (typeof configuration.getThemeMode === "function") {
          const isNight = configuration.getThemeMode() === 1;
          if (typeof onThemeModeChange === 'function') {
            onThemeModeChange(isNight);
          }
        }
        break;
      }
      case "locale": {
        const localObj = configuration.getLocale() || {
          language: "zh",
          countryOrRegion: "CN",
        };
        const isRtl = RTL_LANG.includes(localObj.language);
        if (typeof onLanguageChange === 'function') {
          onLanguageChange({
            isRtl,
            ...localObj,
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("配置变化处理错误:", error);
  }
};

/**
 * 批量注册系统配置监听
 * 用于在页面初始化时设置默认值并注册监听
 * @param {Object} options 配置选项及回调函数
 * @returns {Object} 当前配置状态
 */
export const useConfigurationListener = (options = {}) => {
  // 获取初始配置
  const getInitialConfig = () => {
    let isNight = false;
    let languageConfig = {
      isRtl: false,
      language: "zh",
      countryOrRegion: "CN",
    };

    try {
      // 获取主题模式
      if (typeof configuration.getThemeMode === "function") {
        isNight = configuration.getThemeMode() === 1;
      }

      // 获取语言配置
      const localObj = configuration.getLocale();
      if (localObj) {
        languageConfig = {
          isRtl: RTL_LANG.includes(localObj.language),
          ...localObj,
        };
      }
    } catch (error) {
      console.error("获取初始配置错误:", error);
    }

    return {
      isNight,
      languageConfig,
    };
  };

  // 初始配置状态
  const initialConfig = getInitialConfig();

  // 配置变化处理函数
  const handleConfigurationChange = (event) => {
    useConfiguration(event, options);
  };

  return {
    ...initialConfig,
    handleConfigurationChange,
  };
};

// 以下是使用示例

/**
 * 示例1: 在页面中使用
 */
/*
export default {
  data() {
    return {
      isNight: false,
      language: "zh",
    };
  },
  onInit() {
    // 初始化时获取当前配置
    const { isNight, languageConfig } = useConfigurationListener();
    this.isNight = isNight;
    this.language = languageConfig.language;
  },
  // 监听系统设置变化的生命周期
  onConfigurationChanged(event) {
    useConfiguration(event, {
      onLanguageChange: (params) => {
        console.log("语言变化了:", params);
        this.language = params.language;
      },
      onThemeModeChange: (isNight) => {
        console.log("主题变化了:", isNight);
        this.isNight = isNight;
      },
    });
  },
};
*/

/**
 * 示例2: 使用 useConfigurationListener 简化代码
 */
/*
export default {
  data() {
    return {
      isNight: false,
      language: "zh",
    };
  },
  onInit() {
    // 初始化配置监听
    const {
      isNight,
      languageConfig,
      handleConfigurationChange,
    } = useConfigurationListener({
      onLanguageChange: (params) => {
        this.language = params.language;
      },
      onThemeModeChange: (isNight) => {
        this.isNight = isNight;
      },
    });

    // 设置初始值
    this.isNight = isNight;
    this.language = languageConfig.language;

    // 将处理函数绑定到实例
    this.handleConfigurationChange = handleConfigurationChange;
  },
  onConfigurationChanged(event) {
    // 调用处理函数
    this.handleConfigurationChange(event);
  },
};
*/