import {LAYOUT_MENU_POSITION, LAYOUT_MODE, LAYOUT_TYPE, SIDEBAR_SIZE, THEME} from '@/constants';

export interface LayoutTheme {
  type: {horizontal: LAYOUT_TYPE.horizontal};
  mode: {fluid: LAYOUT_MODE.fluid};
  menuPosition: {fixed: LAYOUT_MENU_POSITION.fixed};
}
export interface ThemeType {
  light: THEME.light;
  dark: THEME.dark;
}
export interface TopbarTheme {
  theme: {dark: THEME.dark};
}
export interface SidebarTheme {
  theme: {brand: THEME.brand};
  size: {default: SIDEBAR_SIZE.default};
  user: {hidden: boolean};
}
export interface rightSidebarToggle {
  toggle: boolean;
}
export interface ThemeSettingsType {
  layout: LayoutTheme;
  theme: ThemeType;
  topbar: TopbarTheme;
  sidebar: SidebarTheme;
  rightSidebar: rightSidebarToggle;
}
export interface ThemeSettingsContext {
  layout: {type: LAYOUT_TYPE; mode: LAYOUT_MODE; menuPosition: LAYOUT_MENU_POSITION};
  theme: THEME;
  topbar: {theme: THEME};
  sidebar: {theme: THEME; size: SIDEBAR_SIZE; user: boolean};
  rightSidebar: {toggle: boolean};
}

export interface ThemeContextType {
  settings: ThemeSettingsContext;
  updateSettings: (newSettings: Partial<ThemeSettingsContext>) => void;
}
