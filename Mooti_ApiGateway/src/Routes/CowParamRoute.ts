import axios from "axios";
import CowParamController from "../Controllers/CowParamController";
import { telegramMessages } from "../utils/responses";
import express from "express";
import cors from "cors";
import mosca from "mosca"
import bodyParser from "body-parser";
import { IOT_HTTP_PORT, MQTT_PORT, server, URI_COW_PARAM, URL_PARAM_SERVICE } from "..";

const corsOptions = {
    origin:"*",
    optionsSuccesStatus:200
}
const iot_http_gateway = express();
iot_http_gateway.use(bodyParser.text());
iot_http_gateway.use(cors(corsOptions));
iot_http_gateway.listen(IOT_HTTP_PORT, ()=>console.log("Http Server Iot listo en el puerto "+IOT_HTTP_PORT));

const broker = new mosca.Server({port:parseInt(MQTT_PORT)});
broker.on('ready', ()=>console.log('Mqtt broker listo en el puerto '+MQTT_PORT));

export default function CowParamRoute(){
    iot_http_gateway
    .post("/", (req, res)=> {
        try{
            //console.log(req.body as string);
            CowParamController.getInstance().ProcessSourceRequest(req.body as string)
            .then(e=> res.json(e))
            .catch(e=>res.json({res:telegramMessages.messageServerError}))
        }
        catch(e){
            console.error("Error: "+e);
        }
    });
 
    broker.on('clientConnected',()=>{
        //console.log("se conecto un dipositivo")
    })

    const RespondDevice = async(id: string, e: any)=>{
        if(id){
            //console.log(JSON.stringify(e));
            broker.publish({
                topic: id,
                payload: `${JSON.stringify(e)}`,
                qos: 0,
                retain: false,
            },(obj,packet)=>{}
            )
        }
    }
    broker.on('published', (packet,client)=>{
        const payload = packet.payload.toString();
        const device_id = client?.id ?? "";
        if(device_id === ""){
            //console.log("pass");
            return;
        }
        //console.log(payload);
        try{
            CowParamController.getInstance().ProcessSourceRequest(payload)
            .then(e=> RespondDevice(device_id, e) )
            .catch(e=> RespondDevice(device_id, {res:telegramMessages.messageServerError}))
        }
        catch(e){
            console.error("Error: "+e);
        }
      
    });

    server.post((`${URI_COW_PARAM}/report`),async (req,res)=>{
        let r;
        try {
            r = await axios.post(`${URL_PARAM_SERVICE+URI_COW_PARAM}/report`,req.body);            
        } catch (e) {
            console.log("Error: "+e)
        }

        res.json(r?.data);    
    })

    server.get(URI_COW_PARAM, async (req, res, next)=>{
        const user_id = req.query.user_id as string ?? "";
        const CowID = req.query.CowID as string ?? "";
        let r;
        try{
            if(CowID !=="" && user_id !==""){
                r = await axios.get(`${URL_PARAM_SERVICE+URI_COW_PARAM}/?user_id=${user_id}&CowID=${CowID}`);            
            }
        }catch(e){
            console.log("Error: "+e)
        }
        res.json(r?.data);
    });
    
}
