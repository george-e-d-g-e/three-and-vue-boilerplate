/* eslint-disable */


module.exports = {
  configureWebpack: {
    devServer: {
      https: true
    },
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
          test: /\.(bin|dat|hiro)$/,
          loader: 'file-loader',
          options: { esModule: false }
        }
      ]
    }
  }
}