
'use strict'
// process = { 
//     env: { NODE_ENV: 'development'},
//     cwd: function(){},
// };
var webpack = require('webpack');
// require('dotenv').config();
const path = require('path')

module.exports = {
    // externals: {
    //     'fs-extra': 'fs-extra',
    //     'fs': 'fs',
    // },
    entry: './client/main.js',
    output: {
        path: __dirname,
        filename: './public/dist/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'vue-loader'],
                // exclude: /node_modules\/(?!(fs)\/).*/,
                // use: [
                //     {
                //         loader: 'babel-loader',
                //     },
                //     {
                //         loader: 'vue-loader',
                //     },
                //     {
                //         loader: 'vue-template-compiler',
                //     }
                // ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "node_modules/")
                ],
                // include: /node_modules\/fs\//,
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [
                    path.resolve(__dirname, "node_modules/fs")
                ],
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ]

            },
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devtool: 'source-map',
    // target: 'node',
    // node: {
    //     fs: 'empty',
    //     net: 'empty',
    //     tls: 'empty',
    // },
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': JSON.stringify('production')
    //     })
    // ],
};
