// TODO: Can we make this enum and does it help us?
export type ThemeType =
  | 'Default'
  | 'Dark'
  | 'HighContrast'
  | 'CVDSafe'
;

export type Theme = {
  name: string;
  isDark: boolean;
  tokens: {
    background: string;
    text: string;

    primary: string;
    onPrimary: string;
    primaryHover: string;
    primaryActive: string;

    secondary: string;
    onSecondary: string;
    secondaryHover: string;
    secondaryActive: string;

    link: string;
    linkHover: string;

    accent: string;
    onAccent: string;

    error: string;
    onError: string;

    shadow?: string;
    overlay?: string;
  };
};

export const themeTokens: Record<string, Theme> = {
  Default: {
    name: 'Default',
    isDark: false,
    tokens: {
      background: '#ECDFCC',
      text: '#181C14',

      primary: '#007BFF',
      onPrimary: '#FFFFFF',
      primaryHover: '#0069D9',
      primaryActive: '#0056B3',

      secondary: '#6C757D',
      onSecondary: '#FFFFFF',
      secondaryHover: '#5A6268',
      secondaryActive: '#545B62',

      link: '#007BFF',
      linkHover: '#0056B3',

      accent: '#FFD54F',
      onAccent: '#000000',

      error: '#D32F2F',
      onError: '#FFFFFF',

      shadow: 'rgba(0, 0, 0, 0.15)',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
  },
  Dark: {
    name: 'Dark',
    isDark: true,
    tokens: {
      background: '#181C14',
      text: '#ECDFCC',

      primary: '#1E88E5',
      onPrimary: '#FFFFFF',
      primaryHover: '#1565C0',
      primaryActive: '#0D47A1',

      secondary: '#90A4AE',
      onSecondary: '#000000',
      secondaryHover: '#78909C',
      secondaryActive: '#607D8B',

      link: '#90CAF9',
      linkHover: '#64B5F6',

      accent: '#FFD54F',
      onAccent: '#000000',

      error: '#EF5350',
      onError: '#000000',

      shadow: 'rgba(0, 0, 0, 0.8)',
      overlay: 'rgba(255, 255, 255, 0.1)',
    },
  },
  HighContrast: {
    name: 'High Contrast',
    isDark: false,
    tokens: {
      background: '#FFFFFF',
      text: '#000000',

      primary: '#000000',
      onPrimary: '#FFFFFF',
      primaryHover: '#333333',
      primaryActive: '#000000',

      secondary: '#FFFFFF',
      onSecondary: '#000000',
      secondaryHover: '#DDDDDD',
      secondaryActive: '#CCCCCC',

      link: '#0000EE',
      linkHover: '#551A8B',

      accent: '#FFFF00',
      onAccent: '#000000',

      error: '#FF0000',
      onError: '#FFFFFF',

      shadow: 'rgba(0, 0, 0, 1)',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
  },
  CVDSafe: {
    name: 'CVD Safe',
    isDark: false,
    tokens: {
      background: '#F7F7F7',
      text: '#2E2E2E',

      // These colors are distinguishable by most people with CVD (from ColorBrewer)
      primary: '#0072B2',           // Blue
      onPrimary: '#FFFFFF',
      primaryHover: '#005C99',
      primaryActive: '#003F66',

      secondary: '#E69F00',         // Orange
      onSecondary: '#000000',
      secondaryHover: '#CC8C00',
      secondaryActive: '#996600',

      link: '#009E73',              // Green
      linkHover: '#007F5F',

      accent: '#56B4E9',            // Light Blue
      onAccent: '#000000',

      error: '#D55E00',             // Red/Orange
      onError: '#FFFFFF',

      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.3)',
    },
  }
};

export const ALL_THEME_TYPES = Object.keys(themeTokens) as ThemeType[];

export const defaultTheme: { type: ThemeType; theme: Theme } = {
  type: 'Default',
  theme: themeTokens['Default'],
};
