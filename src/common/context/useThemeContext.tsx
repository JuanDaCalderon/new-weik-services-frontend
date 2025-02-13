import {
  LAYOUT_MENU_POSITION,
  LAYOUT_MODE,
  LAYOUT_TYPE,
  SIDEBAR_SIZE,
  THEME,
  LOCALSTORAGE_THEME_MODE_KEY
} from '@/constants';
import {ThemeContextType, ThemeSettingsContext, ThemeSettingsType} from '@/types';
import {ReactNode, createContext, useCallback, useContext, useState, JSX} from 'react';
import {LocalStorageUtil} from '@/utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeSettings: ThemeSettingsType = {
  layout: {
    type: {horizontal: LAYOUT_TYPE.horizontal},
    mode: {fluid: LAYOUT_MODE.fluid},
    menuPosition: {fixed: LAYOUT_MENU_POSITION.fixed}
  },
  theme: {light: THEME.light, dark: THEME.dark},
  topbar: {
    theme: {dark: THEME.dark}
  },
  sidebar: {
    theme: {brand: THEME.brand},
    size: {default: SIDEBAR_SIZE.default},
    user: {hidden: false}
  },
  rightSidebar: {toggle: false}
};

function getInitialThemeSettings(): THEME {
  const themeModeValue = LocalStorageUtil.getItem<string>(LOCALSTORAGE_THEME_MODE_KEY);
  if (themeModeValue && themeModeValue in THEME) return THEME[themeModeValue as keyof typeof THEME];
  else return THEME.light;
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('useThemeContext must be used within an ThemeProvider');
  return context;
}

export function ThemeProvider({children}: {children: ReactNode}): JSX.Element {
  const [settings, setSettings] = useState<ThemeSettingsContext>({
    layout: {
      type: ThemeSettings.layout.type.horizontal,
      mode: ThemeSettings.layout.mode.fluid,
      menuPosition: ThemeSettings.layout.menuPosition.fixed
    },
    theme: getInitialThemeSettings(),
    topbar: {
      theme: ThemeSettings.topbar.theme.dark
    },
    sidebar: {
      theme: ThemeSettings.sidebar.theme.brand,
      size: ThemeSettings.sidebar.size.default,
      user: ThemeSettings.sidebar.user.hidden
    },
    rightSidebar: ThemeSettings.rightSidebar
  });

  const updateSettings = useCallback((newSettings: Partial<ThemeSettingsContext>) => {
    setSettings((prev) => ({...prev, ...newSettings}));
  }, []);

  return (
    <ThemeContext.Provider value={{settings, updateSettings}}>{children}</ThemeContext.Provider>
  );
}
