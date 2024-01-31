import * as dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
dotenv.config();
process.env.TZ='America/Lima'

import CowRoutes from "./Routes/CowRoutes";
import ParameterRoutes from "./Routes/ParameterRoutes";
import CowParamRoutes from "./Routes/CowParamRoutes";

const server = express();
server.use(bodyParser.json());

const HTTP_PORT : string = process.env.HTTP_PORT || "";
const URI_COW : string = process.env.URI_COW ?? "";
const URI_COW_PARAM : string = process.env.URI_COW_PARAM || "";

const corsOptions = {
    origin:"*",
    optionsSuccessStatus:200,
};
server.use(cors(corsOptions));
server.listen(HTTP_PORT, ()=>console.log("parameter service running at "+ HTTP_PORT));

CowRoutes();
ParameterRoutes();
CowParamRoutes();

export {server,URI_COW,URI_COW_PARAM}