const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                          publicPath: './'
                        }
                    },
                    { loader: 'css-loader', options: { url: true } }
                ],
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,  
                use: [{
                    loader: 'url-loader',
                    options: { 
                        limit: 10000, // Convert images < 8kb to base64 strings
                        name: 'js/[hash]-[name].[ext]'
                    } 
                }]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
                template: './src/index.html'
            }
        ),
        new MiniCssExtractPlugin({
            filename: '.src/style.css',
        })
    ]
}