export const presets = ['module:@react-native/babel-preset'];
export const plugins = [
  'nativewind/babel',
  [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    },
  ],
];
