module.exports = {
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
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'vue-loader',
                    },
                ]
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
        extensions: ['.js'],
    },
    devtool: 'source-map',
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};
