import {ReactNode, createContext, useCallback, useContext, useState, JSX} from 'react';
import i18n, {isValidLanguage, Languages} from '@/common/languages/i18n';

const ThemeContext = createContext<any>({});

export const ThemeSettings = {
  layout: {
    type: {horizontal: 'horizontal'},
    mode: {fluid: 'fluid'},
    menuPosition: {fixed: 'fixed'}
  },
  theme: {light: 'light'},
  topbar: {
    theme: {dark: 'dark'},
    logo: {show: ''}
  },
  sidebar: {
    theme: {brand: 'brand'},
    size: {default: 'default'},
    user: {hidden: false}
  },
  rightSidebar: {hidden: false}
};

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('useThemeContext must be used within an ThemeProvider');
  return context;
}

export function ThemeProvider({children}: {children: ReactNode}): JSX.Element {
  const [currentLanguage, setCurrentLanguage] = useState(Languages.EN);

  const [settings, setSettings] = useState({
    layout: {
      type: ThemeSettings.layout.type.horizontal,
      mode: ThemeSettings.layout.mode.fluid,
      menuPosition: ThemeSettings.layout.menuPosition.fixed
    },
    theme: ThemeSettings.theme.light,
    topbar: {
      theme: ThemeSettings.topbar.theme.dark,
      logo: ThemeSettings.topbar.logo.show
    },
    sidebar: {
      theme: ThemeSettings.sidebar.theme.brand,
      size: ThemeSettings.sidebar.size.default,
      user: ThemeSettings.sidebar.user.hidden
    },
    rightSidebar: ThemeSettings.rightSidebar.hidden
  });

  const changeLanguage = useCallback((lang: string) => {
    if (isValidLanguage(lang)) {
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
    }
  }, []);

  const updateSettings = useCallback(
    (newSettings: any) => {
      setSettings((prev) => ({...(prev ?? {}), ...(newSettings ?? {})}));
    },
    [setSettings]
  );

  const updateLayout = useCallback(
    (newLayout: any) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        layout: {...(prev ?? {}).layout, ...(newLayout ?? {})}
      }));
    },
    [setSettings]
  );

  const updateTopbar = useCallback(
    (newTopbar: any) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        topbar: {...(prev ?? {}).topbar, ...(newTopbar ?? {})}
      }));
    },
    [setSettings]
  );

  const updateSidebar = useCallback(
    (newSidebar: any) => {
      setSettings((prev) => ({
        ...(prev ?? {}),
        sidebar: {...(prev ?? {}).sidebar, ...(newSidebar ?? {})}
      }));
    },
    [setSettings]
  );

  return (
    <ThemeContext.Provider
      value={{
        changeLanguage,
        currentLanguage,
        settings,
        updateSettings,
        updateLayout,
        updateTopbar,
        updateSidebar
      }}>
      {children}
    </ThemeContext.Provider>
  );
}
