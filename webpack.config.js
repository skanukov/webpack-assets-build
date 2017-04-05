const NODE_ENV = process.env.NODE_ENV || 'development',
    isDevelopment = 'development' == NODE_ENV,
    isProduction = !isDevelopment;

const BabiliPlugin = require('babili-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    webpack = require('webpack');

// Add hash to asset name for production.
function getAssetName() {
    return '[name]' + (isProduction ? '-[hash]' : '');
}

module.exports = {
    context: path.join(__dirname, './assets'),

    entry: {
        bundle: './js/app.js'
    },
    output: {
        path: path.join(__dirname, './public/assets'),
        filename: `${getAssetName()}.js`
    },

    // Define source maps.
    devtool: isDevelopment ? '#cheap-module-inline-source-map'
        : '#cheap-module-source-map',

    module: {
        rules: [
            // Compile SCSS.
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?sourceMap&importLoaders=1!' +
                    'postcss-loader!' +
                    'sass-loader?sourceMap'
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
        new ExtractTextPlugin(`${getAssetName()}.css`)
    ],

    watch: isDevelopment,
    watchOptions: {
        poll: true
    }
};

// Minify assets for production.
if (isProduction) {
    module.exports.plugins.push(
        // Enable CSS minification.
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        // Minify assets.
        new BabiliPlugin()
    );
}
