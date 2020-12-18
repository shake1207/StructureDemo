// module.exports = {
//   presets: ["@vue/cli-plugin-babel/preset"]
// };

// module.exports = {
//   presets: [["@vue/cli-plugin-babel/preset", {
//     useBuiltIns: "usage",
//     polyfills: [
//       // module filenames from .\node_modules\core-js\modules\
//       'es.promise',  // before "es6.promise"
//       'es.symbol',  // before "es6.symbol"
//     ],
//   }]]
// }

module.exports = {
  presets: [
    [
      '@vue/app',
      {
        useBuiltIns: 'entry',
        polyfills: ['es.promise', 'es.symbol']
      }
    ]
  ]
};
