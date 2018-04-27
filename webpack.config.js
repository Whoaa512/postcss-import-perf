/* eslint-env node */

const path = require('path')

const CleanPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

const rootDir = path.resolve(__dirname)
const outputDir = 'build'
const outputPath = path.resolve(rootDir, outputDir)

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        consumer: path.resolve('./src/index.js'),
    },
    externals: {},
    module: {
        rules: [
            {
                exclude: /react-select\/dist\/react-select\.css$/,
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            localIdentName: '[local]___[hash:base64:5]',
                            minimize: false,
                            modules: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: [
                                require('postcss-devtools'),
                                require('postcss-import')({
                                    root: rootDir,
                                    skipDuplicates: true,
                                    path: [path.resolve(rootDir, 'src/styles')],
                                }),
                                require('postcss-define-property'),
                                require('postcss-color-hexa'),
                                require('postcss-mixins'),
                                require('postcss-custom-media'),
                                require('postcss-cssnext')({
                                    features: {
                                        autoprefixer: { remove: false },
                                    },
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                exclude: [/node_modules/],
                include: [path.resolve('./src'), path.resolve('./tests')],
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                '@babel/preset-env',
                            ],
                            plugins: [
                                [
                                    'babel-plugin-module-resolver',
                                    {
                                        cwd: 'babelrc',
                                        alias: {
                                            '~': path.resolve('./src'),
                                        },
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
        ],
    },
    output: {
        chunkFilename: '[chunkhash].js',
        filename: '[name].localhost.js',
        path: path.resolve('./build'),
        publicPath: '//localhost:3001/',
        crossOriginLoading: 'anonymous',
    },
    plugins: [
        new CleanPlugin([outputPath], { root: rootDir }),
        new webpack.DefinePlugin({
            __RELEASE_ID__: '"localhost"',
            __INIT_APPS__: true,
            __RAVEN_DSN__: '""',
            'process.env': {
                NODE_ENV: '"development"',
            },
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    mode: 'development',
    optimization: {
        namedModules: true,
        splitChunks: {
            name: 'shared',
            minChunks: 2,
        },
        minimize: false,
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx'],
        modules: [path.resolve('./tests'), path.resolve('./src'), 'node_modules'],
    },
}
