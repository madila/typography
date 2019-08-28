const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");


const config = {
    entry: {
        "scripts": './src/index.js'
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'assets')
    },
    plugins: [],
    module: {
        rules: [],
    }
};

module.exports = (env, argv) => {
    config.mode = argv.mode || 'development';
    config.plugins = [
        new CleanWebpackPlugin(),
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: argv.mode === 'development' ? './../[name].css' : './../[name].min.css',
            chunkFilename: argv.mode === 'development' ? './../[id].css' : './../[id].min.css'
        })
    ];
    config.module.rules.push({
        test: /\.scss$/i,
        use: [
            // Creates `style` nodes from JS strings
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath:  path.resolve(__dirname),
                    hmr: argv.mode === 'development',
                },
            },
            'css-loader',
            'sass-loader',
            'postcss-loader'
        ],
    })
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.output.filename = '[name].js';
        config.watch = true;
    }
    if (argv.mode === 'production') {
        config.optimization = {
            minimize: true
        };
    }
    return config;
};
