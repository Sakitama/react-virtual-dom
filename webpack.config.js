let path = require('path');

module.exports = {
    context: path.resolve(__dirname, 'src/js'),
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'main.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    }
};