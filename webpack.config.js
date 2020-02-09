const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            // {
            //     test: /\.(png|jpe?g|gif)$/i,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 40000,
            //                 name: '[name].[contenthash].[ext]',
            //                 outputPath: 'assets/images/',
            //                 publicPath: 'assets/images/'
            //             }
            //         },
            //         image-webpack-loader
            //     ],
            // },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader'],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
                template: './src/index.html'
            }
        ),
        new MiniCssExtractPlugin({
            filename: "css/style.css",
        })
    ]
}