module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/**/*.html', './src/**/*.json', './src/**/*.svg', './src/**/*.liquid', './src/**/*.js'],
    safelist: [],
  },
  theme: {
    screens: {
      tablet: '768px',
      desktop: '1024px',
      widescreen: '1440px',
      extrawide: '1920px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      // add custom colors here, refer to: https://tailwindcss.com/docs/customizing-colors
    },
    fontWeight: {
      400: 400,
      500: 500,
      700: 700,
    },
    fontFamily: {
      // add font families here:
      // ex: sans: ['Helvetica', 'sans-serif']
    },
    fontSize: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px', //only used for forms
      20: '20px',
      24: '24px',
      32: '32px',
    },
    spacing: {
      //add spacing as needed. keep multiples of 4, comment any anomalies
      0: '0px',
      4: '4px',
      8: '8px',
      12: '12px',
      16: '16px',
      20: '20px',
      24: '24px',
      32: '32px',
      36: '36px',
      40: '40px',
      48: '48px',
      56: '56px',
      64: '64px',
    },
    extend: {},
  },
  // include if more variants are necessary. for defaults, refer to: https://tailwindcss.com/docs/configuring-variants
  variants: {
    extend: {
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
