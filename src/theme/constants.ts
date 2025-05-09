// Theme constants for the application

export const colors = {
  // Primary colors
  primary: {
    main: '#07515F',
    hover: '#064249',
    light: '#E6EEF0',
  },
  
  // Text colors
  text: {
    primary: '#475569',
    secondary: '#64748B',
    light: '#94A3B8',
  },
  
  // Background colors
  background: {
    main: '#FFFFFF',
    secondary: '#F8FAFC',
    highlight: '#F1F5F9',
  },
  
  // Border colors
  border: {
    light: '#E2E8F0',
    main: '#CBD5E1',
  }
};

export const typography = {
  fontFamily: {
    primary: 'Montserrat, sans-serif',
    secondary: 'Inter, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
};

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
};

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  full: '9999px',
};

export const transitions = {
  default: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}; 