import * as dotenv from "dotenv"
dotenv.config();

process.env.TZ='America/Lima'

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"


const WEBSOCKETS_PORT:string = process.env.WEBSOCKETS_PORT ?? "";
const IOT_HTTP_PORT:string = process.env.IOT_HTTP_PORT ?? "";
const MQTT_PORT:string = process.env.MQTT_PORT ?? "";
const HTTP_PORT:string = process.env.HTTP_PORT ?? "";

//const HTTP_DOMAIN_URL = process.argv[2]!=undefined?process.argv[2]:"domain-test.com";
const HTTP_DOMAIN_URL:string = process.env.URL_APIGATEWAY ?? ""; //docker compose
const URL_USER:string = process.env.URL_USER ?? ""; // docker compose
const URL_PARAMETER:string = process.env.URL_PARAMETER ?? ""; // docker compose

//${HTTP_DOMAIN_URL === "mooti-apigateway.eastus.azurecontainer.io"?`:${HTTP_PORT}`:""}
const TOKEN:string = process.env.TOKEN ?? "";
const URL_WEBHOOK:string = `https://${HTTP_DOMAIN_URL}/webhook/${TOKEN}` ?? "";
const URL_USER_SERVICE:string = `http://${URL_USER}:${process.env.USER_SERVICE_PORT}` ?? ""
const URL_PARAM_SERVICE:string = `http://${URL_PARAMETER}:${process.env.PARAM_SERVICE_PORT}` ?? "";
const URL_TELEGRAM:string = `${process.env.TELEGRAM_URL}${TOKEN}` ?? "";

const URI_COW_PARAM:string = process.env.URI_COW_PARAM ?? "";
const URI_COW:string = process.env.URI_COW ?? "";
const URI_PARAM:string = process.env.URI_PARAM ?? "";
const URI_USER:string = process.env.URI_USER ?? "";
const URI_USER_LOGIN:string = process.env.URI_USER_LOGIN ?? "";
const URI_USER_TELEGRAM:string = process.env.URI_USER_TELEGRAM ?? "";
const URI_WEBHOOK:string = `/webhook/${TOKEN}` ?? "";


console.log(URL_USER_SERVICE);
console.log(URL_PARAM_SERVICE);
console.log(URL_WEBHOOK);

const server = express();
server.use(bodyParser.json());

import UserRoute from "./Routes/UserRoute"
import ParameterRoute from "./Routes/ParameterRoute"
import CowRoute from "./Routes/CowRoute"
import CowParamRoute from "./Routes/CowParamRoute"
import BotRoute from "./Routes/BotRoute";


const corsOptions = {
    origin:"*",
    optionsSuccesStatus:200
}
server.use(cors(corsOptions));
server.listen(HTTP_PORT, ()=>console.log("Http Server listo en el puerto "+HTTP_PORT));

server.route("/")
.all((req,res,next)=> next())
.get((req,res, next)=>{
    res.json({res:"WELCOME"})
});

(async function(){
    await BotRoute();
    CowParamRoute();    
    UserRoute();
    CowRoute();
    ParameterRoute();
})();

export {
    server, 
    URI_COW_PARAM,
    URL_PARAM_SERVICE,
    WEBSOCKETS_PORT,
    URL_USER,
    URL_PARAMETER,
    URL_WEBHOOK,
    URL_USER_SERVICE,
    URI_USER_TELEGRAM,
    URL_TELEGRAM,
    URI_WEBHOOK,
    URI_COW,
    IOT_HTTP_PORT,
    MQTT_PORT,
    URI_PARAM,
    URI_USER,
    URI_USER_LOGIN
}