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
                test: /react-select\/dist\/react-select\.css$/,
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
                            minimize: false,
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
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
                            minimize: false,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                            modifyVars: {
                                'primary-color': '#16bc9c',
                                'green-6': '#16bc9c',
                                'warning-color': '#f0ad44',
                                'info-color': '@primary-color',
                                'success-color': '@primary-color',
                                'processing-color': '@primary-color',
                                'error-color': '#e74330',
                                'highlight-color': '@error-color',
                                'normal-color': '#bbb5c3',
                                'link-color': '#5b87f2',
                                'link-hover-color': '#2c64ee',
                                'link-active-color': 'color(@link-color, 7)',
                                'btn-font-weight': 300,
                                'font-family-no-number':
                                    'Museo-Sans, Arial, Helvetica, sans-serif',
                                'font-family':
                                    'Museo-Sans, Arial, Helvetica, sans-serif',
                            },
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
                                [
                                    '@babel/preset-env',
                                    {
                                        exclude: [
                                            'es6.promise',
                                            'transform-regenerator',
                                            'transform-async-to-generator',
                                        ],
                                        useBuiltIns: 'usage',
                                        modules: false,
                                    },
                                ],
                                '@babel/preset-react',
                                '@babel/preset-flow',
                            ],
                            env: {
                                test: {
                                    presets: [
                                        '@babel/preset-env',
                                        '@babel/preset-react',
                                        '@babel/preset-flow',
                                    ],
                                },
                                development: {
                                    plugins: ['babel-plugin-lodash'],
                                },
                                production: {
                                    plugins: ['babel-plugin-lodash'],
                                },
                            },
                            plugins: [
                                'react-hot-loader/babel',
                                [
                                    'module:fast-async',
                                    {
                                        useRuntimeModule: true,
                                    },
                                ],
                                [
                                    '@babel/plugin-transform-runtime',
                                    {
                                        regenerator: false,
                                        helpers: true,
                                        polyfill: true,
                                    },
                                ],
                                [
                                    'babel-plugin-module-resolver',
                                    {
                                        cwd: 'babelrc',
                                        alias: {
                                            '~': path.resolve('./src'),
                                        },
                                    },
                                ],
                                'babel-plugin-syntax-async-functions',
                                'babel-plugin-transform-promise-to-bluebird',
                                '@whoaa/babel-plugin-add-react-displayname',
                                'babel-plugin-transform-decorators-legacy',
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-transform-exponentiation-operator',
                                '@babel/plugin-proposal-export-default-from',
                                '@babel/plugin-proposal-export-namespace-from',
                                [
                                    'babel-plugin-import-7',
                                    {
                                        libraryName: 'antd',
                                        libraryDirectory: 'es',
                                        style: true,
                                    },
                                ],
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-proposal-optional-chaining',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.woff$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff',
                        },
                    },
                ],
            },
            {
                test: /\.woff2$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff2',
                        },
                    },
                ],
            },
            {
                test: /\.[ot]tf$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/octet-stream',
                        },
                    },
                ],
            },
            {
                test: /\.eot$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/vnd.ms-fontobject',
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                        },
                    },
                ],
            },
            {
                test: /\.(glsl|vert|frag|vs|fs)$/,
                use: [
                    {
                        loader: 'raw-loader',
                    },
                ],
            },
            {
                test: /\.(stl)$/,
                use: [
                    {
                        loader: 'file-loader',
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
