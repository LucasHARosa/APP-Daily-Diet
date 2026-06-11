/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NunitoSans_400Regular'],
        'sans-md': ['NunitoSans_500Medium'],
        'sans-sb': ['NunitoSans_600SemiBold'],
        'sans-bd': ['NunitoSans_700Bold'],
      },
      colors: {
        redDark: '#BF3B44',
        redMid: '#F3BABD',
        redLight: '#F4E6E7',

        greenDark: '#639339',
        greenMid: '#CBE4B4',
        greenLight: '#E5F0DB',

        gray1: '#1B1D1E',
        gray2: '#333638',
        gray3: '#5C6265',
        gray4: '#B9BBBC',
        gray5: '#DDDEDF',
        gray6: '#EFF0F0',
        gray7: '#FAFAFA',
      },
    },
  },
  plugins: [],
};
