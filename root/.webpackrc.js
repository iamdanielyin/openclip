module.exports = {
  "entry": "src/index.js",
  "extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  "ignoreMomentLocale": true,
  "html": {
    "template": "./src/index.ejs"
  },
  "disableDynamicImport": true,
  "hash": true,
  "define": {
    "process.env": {},
    "process.env.__ORIGIN__": process.env.__ORIGIN__
  },
  "proxy": {
    "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true
    },
    "/upload": {
      "target": "http://localhost:3000",
      "changeOrigin": true
    },
  }
};