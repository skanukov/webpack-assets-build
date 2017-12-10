const NODE_ENV = process.env.NODE_ENV || 'development',
  isDevelopment = 'development' === NODE_ENV,
  isProduction = !isDevelopment;

const ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MinifyPlugin = require('babel-minify-webpack-plugin'),
  path = require('path'),
  webpack = require('webpack');

// Add hash to asset name for production.
const getAssetName = () => {
  return 'static/[name]' + (isProduction ? '-[hash]' : '');
};

const getCssLoader = () => {
  return (
    'css-loader?' + (isDevelopment ? 'sourceMap&' : '') + 'importLoaders=1'
  );
};

const getPostCssLoader = (loader = 'postcss-loader') => {
  return loader + (isDevelopment ? '?sourceMap' : '');
};

module.exports = {
  context: path.join(__dirname, './src'),

  entry: {
    bundle: './assets/js/app.js'
  },
  output: {
    path: path.join(__dirname, './build'),
    publicPath: '/',
    filename: `${getAssetName()}.js`
  },

  // Define source maps.
  devtool: isDevelopment ? '#cheap-module-inline-source-map' : false,

  module: {
    rules: [
      // Compile SCSS.
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: `${getCssLoader()}!${getPostCssLoader()}!${getPostCssLoader(
            'sass-loader'
          )}`
        })
      },

      // Copy images, fonts, etc.
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png$|\.jpe?g$|\.gif$/,
        use: `file-loader?name=${getAssetName()}.[ext]`
      }
    ]
  },

  plugins: [
    // Extract CSS to separate file.
    new ExtractTextPlugin(`${getAssetName()}.css`),

    // Build the index page.
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index.html',
      minify: isDevelopment
        ? false
        : {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true
          }
    })
  ],

  watch: isDevelopment
};

// Minify assets for production.
if (isProduction) {
  module.exports.plugins.push(
    // Minify CSS.
    new webpack.LoaderOptionsPlugin({ minimize: true }),

    // Minify JS.
    new MinifyPlugin()
  );
}
