/**
 * 应用配置 1060+
 * 接口声明: 无需声明
 */
declare module "@system.configuration" {
  interface configurationObj {
    language: string; // 语言
    countryOrRegion: string; // 国家或地区
  }
  /**
   * 获取应用当前的语言环境。默认使用系统的语言环境，会因为设置或系统语言环境改变而发生变化
   *
   */
  function getLocale(): configurationObj;

  /**
   * 获取应用当前的主题模式。
   * [1070+]
   * @return 0：日间模式，1：夜间模式
   */
  function getThemeMode(): number;
}

/**
 * 设备信息 1060+
 * 接口声明: 无需声明
 */
declare module "@system.device" {
  interface DeviceInfo {
    /**
     * 屏幕宽度，单位为px
     */
    screenWidth: number;
    /**
     * 屏幕高度，单位为px
     */
    screenHeight: number;
    /**
     * 屏幕方向，值为 "portrait"(竖屏) 或 "landscape"(横屏)
     */
    screenOrientation: string;
  }

  /**
   * 获取设备信息
   */
  function getInfo(): DeviceInfo;
}

interface ConfigurationOptions {
  onThemeModeChange?: (isNight: boolean) => void;
  onLanguageChange?: (params: {
    isRtl: boolean;
    language: string;
    countryOrRegion: string;
  }) => void;
  onOrientationChange?: (orientation: string) => void;
  onScreenSizeChange?: (screenSize: {
    width: number;
    height: number;
  }) => void;
  onConfigurationChanged?: (event: ConfigurationEvent) => void;
}

interface ConfigurationEvent {
  type: "locale" | "themeMode" | "orientation" | "screenSize";
}

import configuration from "@system.configuration";
import device from "@system.device";

const RTL_LANG = ["ar"];

/**
 * 系统配置监听 Hook
 * 用于处理快应用中系统配置变化的事件
 * @param event 配置变化事件对象
 * @param options 配置选项及回调函数
 */
export const useConfiguration = (event: ConfigurationEvent, options: ConfigurationOptions = {}) => {
  const { type } = event;
  const {
    onThemeModeChange,
    onLanguageChange,
    onOrientationChange,
    onScreenSizeChange,
    onConfigurationChanged,
  } = options;

  // 触发通用配置变化回调
  onConfigurationChanged?.(event);

  try {
    switch (type) {
      case "themeMode": {
        // 检查是否支持主题模式API
        if (typeof configuration.getThemeMode === "function") {
          const isNight = configuration.getThemeMode() === 1;
          onThemeModeChange?.(isNight);
        }
        break;
      }
      case "locale": {
        const localObj = configuration.getLocale() || {
          language: "zh",
          countryOrRegion: "CN",
        };
        const isRtl = RTL_LANG.includes(localObj.language);
        onLanguageChange?.({
          isRtl,
          ...localObj,
        });
        break;
      }
      case "orientation": {
        // 获取屏幕方向
        const deviceInfo = device.getInfo();
        const orientation = deviceInfo?.screenOrientation || "portrait";
        onOrientationChange?.(orientation);
        break;
      }
      case "screenSize": {
        // 获取屏幕尺寸
        const deviceInfo = device.getInfo();
        const screenSize = {
          width: deviceInfo?.screenWidth || 0,
          height: deviceInfo?.screenHeight || 0,
        };
        onScreenSizeChange?.(screenSize);
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
 * @param options 配置选项及回调函数
 * @returns 当前配置状态
 */
export const useConfigurationListener = (options: ConfigurationOptions = {}) => {
  // 获取初始配置
  const getInitialConfig = () => {
    let isNight = false;
    let languageConfig = {
      isRtl: false,
      language: "zh",
      countryOrRegion: "CN",
    };
    let orientation = "portrait";
    let screenSize = {
      width: 0,
      height: 0,
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

      // 获取设备信息
      const deviceInfo = device.getInfo();
      if (deviceInfo) {
        orientation = deviceInfo.screenOrientation;
        screenSize = {
          width: deviceInfo.screenWidth,
          height: deviceInfo.screenHeight,
        };
      }
    } catch (error) {
      console.error("获取初始配置错误:", error);
    }

    return {
      isNight,
      languageConfig,
      orientation,
      screenSize,
    };
  };

  // 初始配置状态
  const initialConfig = getInitialConfig();

  // 配置变化处理函数
  const handleConfigurationChange = (event: ConfigurationEvent) => {
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
      orientation: "portrait",
      screenWidth: 0,
      screenHeight: 0,
    };
  },
  onInit() {
    // 初始化时获取当前配置
    const { isNight, languageConfig, orientation, screenSize } = useConfigurationListener();
    this.isNight = isNight;
    this.language = languageConfig.language;
    this.orientation = orientation;
    this.screenWidth = screenSize.width;
    this.screenHeight = screenSize.height;
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
      onOrientationChange: (orientation) => {
        console.log("屏幕方向变化了:", orientation);
        this.orientation = orientation;
      },
      onScreenSizeChange: (screenSize) => {
        console.log("屏幕尺寸变化了:", screenSize);
        this.screenWidth = screenSize.width;
        this.screenHeight = screenSize.height;
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
      orientation: "portrait",
      screenWidth: 0,
      screenHeight: 0,
    };
  },
  onInit() {
    // 初始化配置监听
    const {
      isNight,
      languageConfig,
      orientation,
      screenSize,
      handleConfigurationChange,
    } = useConfigurationListener({
      onLanguageChange: (params) => {
        this.language = params.language;
      },
      onThemeModeChange: (isNight) => {
        this.isNight = isNight;
      },
      onOrientationChange: (orientation) => {
        this.orientation = orientation;
      },
      onScreenSizeChange: (screenSize) => {
        this.screenWidth = screenSize.width;
        this.screenHeight = screenSize.height;
      },
    });

    // 设置初始值
    this.isNight = isNight;
    this.language = languageConfig.language;
    this.orientation = orientation;
    this.screenWidth = screenSize.width;
    this.screenHeight = screenSize.height;

    // 将处理函数绑定到实例
    this.handleConfigurationChange = handleConfigurationChange;
  },
  onConfigurationChanged(event) {
    // 调用处理函数
    this.handleConfigurationChange(event);
  },
};
*/