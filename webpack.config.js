const path = require("path");
module.exports = {
    entry: './firebase.js',
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: 'bundle.js
    }, 
    devtool: 'eval-source-map',
    watch: true,
    mode: 'development',
    module: {
        rules: [
                   {  
                       test: /\. css$/, use: 'css-loader',
                       use: ["style-loader", "css-loader"],
                   },
        ],
    },
    resolve: {
         extensions: ['', '.js', '.jsx', '.css'],
         modules: [
             'node_modules'
         ]
    },
};
