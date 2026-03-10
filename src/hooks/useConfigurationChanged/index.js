import configuration from "@system.configuration";
import { CONFIGURATION_TYPE, RTL_LANGS } from "../constants/enum";
const checkRTL = (langCode) => {
  if (!langCode) return false;
  const code = langCode.split("-")[0].toLowerCase();
  return RTL_LANGS.includes(code);
};
const useConfiggurationChanged = (event, options) => {
  const { type, params } = event;
  if (type === CONFIGURATION_TYPE.LOCALE) {
    console.log("语言变化");
    const langObj = configuration.getLocale() || {};
    const isRtl = checkRTL(langObj.language);
    options?.onLocaleChange?.({
      isRtl,
      ...langObj,
    });
  }
  if (type === CONFIGURATION_TYPE.THEME_MODE) {
    console.log("主题变化");
    const themeMode = configuration.getThemeMode();
    options?.onThemeModeChange?.({
      dark: themeMode === 1,
      themeMode,
      themeModeString:
        themeMode === 0 ? "light" : themeMode === 1 ? "dark" : "light",
    });
  }
};
export const initialTheme = () => {
  const themeMode = configuration.getThemeMode();
  return {
    dark: themeMode === 1,
    themeMode,
    themeModeString:
      themeMode === 0 ? "light" : themeMode === 1 ? "dark" : "light",
  };
};

export default useConfiggurationChanged;