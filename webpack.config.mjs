import path from 'path'
import webpack from 'webpack'
import { fileURLToPath } from 'url'
import { VueLoaderPlugin } from 'vue-loader'
import { generateVueRoutesFile } from './config/generate-vue-routes-file.mjs'

generateVueRoutesFile()

// config vars
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const port = 8080
const host = '0.0.0.0'
const publicPathname = '/packs/'
const srcDir = 'app/javascript'
const publicPath = `http://${host}:${port}${publicPathname}`
const webSocketURL = `ws://${host}:${port}/ws`
const stylesPipeline = ['style-loader', 'css-loader']
const plugins = [
  new webpack.ProgressPlugin(),
  new webpack.DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  }),
  new VueLoaderPlugin(),
]
// removing ProgressPlugin for silent mode
if (process.env.SILENT) {
  plugins.splice(0, 1)
}

console.log('Webpack is building ...')

// main config
export default /** @type import('webpack').Configuration */ ({
  mode: 'development',
  stats: 'normal',
  entry: {
    main: './app/javascript/main.js',
  },
  output: {
    // https://github.com/gaearon/react-hot-loader/issues/641#issuecomment-915841235
    // https://github.com/webpack/webpack-dev-server/issues/1385#issuecomment-502758062
    publicPath,
    filename: 'js/[name].js',
    path: path.resolve(__dirname, `public${publicPathname}`),
    assetModuleFilename: 'images/[name][ext]',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: { '~': path.resolve(__dirname, srcDir) },
  },
  // https://webpack.js.org/guides/build-performance/#devtool
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    open: false,
    host,
    port,
    allowedHosts: 'all',
    headers: { 'Access-Control-Allow-Origin': '*' },
    client: { webSocketURL },
  },
  plugins,
  module: {
    rules: [
      { test: /\.(graphql|gql)$/, loader: 'graphql-tag/loader' },
      { test: /\.vue?$/, loader: 'vue-loader' },
      { test: /\.pug$/, loader: 'pug-plain-loader' },
      { test: /\.css$/i, use: stylesPipeline },
      { test: /\.scss$/i, use: [...stylesPipeline, 'sass-loader'] },
      {
        test: /\.sass$/i,
        use: [
          ...stylesPipeline,
          {
            loader: 'sass-loader',
            options: { sassOptions: { indentedSyntax: true } },
          },
        ],
      },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
    ],
  },
})
