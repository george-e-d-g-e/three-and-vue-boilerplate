/* eslint-disable */

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.gltf$/,
          use: [
            {
              loader: 'file-loader',
              options: { esModule: false }
            },
            '@vxna/gltf-loader'
          ]
        },
        {
          test: /\.(bin|jpe?g|png)$/,
          loader: 'file-loader',
          options: { esModule: false }
        }
      ]
    }
  }
}