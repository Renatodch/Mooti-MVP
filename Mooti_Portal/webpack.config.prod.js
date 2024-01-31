/* npm i @babel/core babel-loader html-webpack-plugin webpack webpack-cli webpack-dev-server --save-dev */

const path = require('path'); //Nos permite acceder a donde estámos en las carpetas. Ya sea en local o en la nube.
const HtmlWebpackPlugin = require('html-webpack-plugin'); //Archivo necesario para trabajar con HTML.
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {  //Aquí se encuentra toda la configuración de lo que va a suceder. Modulo para exportar.
    mode:'production',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: [
        './src/index.js'
    ], //Punto de entrada con su dirección.Aquí vive el código inicial y de aquí parte al desarrollo.

    output: { //Donde se envía el proyecto estructurado y compilado listo para producción.
        path: path.resolve(__dirname, 'prod'),  //Creamos el lugar dónde se exportará el proyecto.
        filename: 'main.js', //Este es el nombre del archivo final para producción.
        publicPath: "./",
    },
    resolve: {
        extensions: ['.js'], //Extensiones que vamos a utilizar.
    },
    module: { //Se crea un modulo con las reglas necesarias que vamos a utilizar.
        rules: [    //Reglas
            {   // Estructura de Babel
                test: /\,js?$/, //Nos permite identificar los archivos según se encuentran en nuestro entorno.
                exclude: /node_modules/,    //Excluimos la carpeta de node modules
                use: {
                    loader: 'babel-loader',    //Utilizar un loader como configuración establecida.
                }
            },
            {
                test:/\.css$/,
                use:[           
                    {loader: MiniCssExtractPlugin.loader},
                    {loader:'css-loader'},
                ]
            },  
            {
                test: /\.scss$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader:"sass-loader"}
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i, // image file
                type:"asset/resource"
            }
        ]
    },
    plugins: [  //Establecemos los plugins que vamos a utilizar
        new HtmlWebpackPlugin(    //Permite trabajar con los archivos HTML
        {
            inject: true,   //Cómo vamos a inyectar un valor a un archivo HTML.
            template: './public/index.html',    //Dirección donde se encuentra el template principal
            filename: 'index.html',    //El nombre que tendrá el archivo
            //chunks: ['index']
            //scriptLoading:'blocking'
        }),
            
        new CopyWebpackPlugin(
            {
                patterns:[
                    {
                        from: './public/assets/loading.gif',
                        to: './assets'
                    },
                    {
                        from: './public/assets/login.jpg',
                        to: './assets'
                    },
                    {
                        from: './public/assets/ico.ico',
                        to: './assets'
                    },
                    {
                        from: './public/assets/MOOTI.png',
                        to: './assets'
                    },
                    {
                        from: './public/assets/dataFormat.png',
                        to: './assets'
                    },
                    {
                        from: './public/assets/cows.jpeg',
                        to: './assets'
                    },
                    {
                        from: './public/@popperjs',
                        to: './@popperjs'
                    },
                    {
                        from: './public/jquery',
                        to: './jquery'
                    },
                    {
                        from: './public/bootstrap',
                        to: './bootstrap'
                    },
                    {
                        from: './public/bootstrapv5-multiselect',
                        to: './bootstrapv5-multiselect'
                    },
                    {
                        from: './public/datatables.net/',
                        to: './datatables.net/'
                    },
                    {
                        from: './public/datatables.net-bs5/',
                        to: './datatables.net-bs5/'
                    },
                    
                ]
            }
        ),
        
        new MiniCssExtractPlugin(
            {
                filename:'[name].css'
            }
        ),
        new webpack.ProvidePlugin({
            //$: 'jquery',
            //jQuery: 'jquery',
        }),
        new Dotenv(),
    ],

}