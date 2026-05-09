const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

const root = path.resolve(__dirname, '..');
const stubs = path.resolve(__dirname, 'web-stubs');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'web-dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-permissions': path.resolve(
        stubs,
        'react-native-permissions.js'
      ),
      '@react-native-documents/picker': path.resolve(
        stubs,
        'react-native-documents-picker.js'
      ),
      '@react-native-community/slider': path.resolve(
        stubs,
        'react-native-community-slider.js'
      ),
      // Resolve the library directly from source in the monorepo
      '@nodefinity/react-native-music-library': path.resolve(
        root,
        'src/index.tsx'
      ),
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@react-native/babel-preset',
                { disableImportExportTransform: true },
              ],
            ],
            plugins: ['react-native-web'],
          },
        },
        exclude:
          /node_modules\/(?!(react-native-web|react-native-audio-pro|react-native-safe-area-context|react-native-screens|@react-navigation)\/).*/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      __DEV__: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  devServer: {
    port: 8080,
    hot: true,
  },
};
