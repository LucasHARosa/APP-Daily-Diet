export const colors = {
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
  white: '#FFFFFF',
} as const;

export type AppColor = keyof typeof colors;
