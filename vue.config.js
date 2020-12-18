const defaultSettings = require('./src/settings.js');

const name = defaultSettings.title || 'Structure';

module.exports = {
  publicPath: '/structure/dist',
  configureWebpack: {
    name,
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`;
            }
          }
        }
      }
    }
  },
  transpileDependencies: ['vuex-persist', 'swiper', 'dom7', 'ssr-window', '@google']
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
};
