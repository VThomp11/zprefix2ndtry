const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
        },
    },

    entry: './src/index.js', // Entry point of your application
    output: {
        filename: 'bundle.js', // Output file name
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Use Babel to transpile JavaScript
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'], // Process CSS files
            },
            // Add more rules for other asset types (e.g., images, fonts) as needed
        ],
    },
    // Additional configuration options as needed
};
