import {LAYOUT_MENU_POSITION, LAYOUT_MODE, LAYOUT_TYPE, SIDEBAR_SIZE, THEME} from '@/constants';
import {ThemeContextType, ThemeSettingsContext, ThemeSettingsType} from '@/types';
import {ReactNode, createContext, useCallback, useContext, useState, JSX} from 'react';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeSettings: ThemeSettingsType = {
  layout: {
    type: {horizontal: LAYOUT_TYPE.horizontal},
    mode: {fluid: LAYOUT_MODE.fluid},
    menuPosition: {fixed: LAYOUT_MENU_POSITION.fixed}
  },
  theme: {light: THEME.light},
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

export function useThemeContext() {
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
    theme: ThemeSettings.theme.light,
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

  const updateSettings = useCallback(
    (newSettings: Partial<ThemeSettingsContext>) => {
      setSettings((prev) => ({...(prev ?? {}), ...(newSettings ?? {})}));
    },
    [setSettings]
  );

  return (
    <ThemeContext.Provider value={{settings, updateSettings}}>{children}</ThemeContext.Provider>
  );
}
