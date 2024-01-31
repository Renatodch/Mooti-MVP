import mqtt from "mqtt"
import ISource from "../device-interface";

const MQTT_ENDPOINT = process.env.MQTT_ENDPOINT;
const TOPIC = process.env.TOPIC;

/*
console.log = (function() {
    var console_log = console.log;
    var timeStart = new Date().getTime();
    
    return function() {
      var delta = new Date(Date.now()).getTime() - timeStart;
      var args = [];
      args.push((delta / 1000).toFixed(2) + ':');
      
      for(var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      
      console_log.apply(console, args);
    };
})();
*/

export default class SourceMqttClient implements ISource{
    data:Array<any>;
    Client?:mqtt.MqttClient;
    options:any;
    deviceName:string;
    
    constructor(
        public user_id:string,
        public cow_id:string,
        public param_id:string
    ){
        this.data = new Array<any>();
        this.deviceName = `${this.user_id}_${this.cow_id}_${this.param_id}`
        this.SetOptions();

    }

    SetOptions(){
        this.options = {
            clientId:this.deviceName, 
            keepalive:60,
            reconnectPeriod: 1000,
            connectTimeout: 90*1000,
            resubscribe: true,
            queueQoSZero: true,   
            rejectUnauthorized: true,
            clean : true,
        }
    }

    AddPacket = (packet:any):void =>{
        this.data.push(packet);
    }

    Connect = ()=>{
        if(!this.Client?.connected){
            
            this.Client = mqtt.connect(`${MQTT_ENDPOINT}`,this.options);
            //this.Client.on("packetreceive",(packet)=>console.log(""));
            this.Client.subscribe(this.deviceName);
            this.Client.on("message",(topic,payload,packet)=>{
                console.log(payload.toString());
            });
            this.Client.on("connect", this.Connected);
            this.Client.on('close', this.Disconnected);
        }
    }
    Send=(datetime:string, value:string)=>{
        if(!this.Client?.connected){
            this.Client = mqtt.connect(`${MQTT_ENDPOINT}`,this.options);
            //this.Client.on("packetreceive",(packet)=>console.log(""));
            this.Client.subscribe(this.deviceName);
            this.Client.on("message",(topic,payload,packet)=>{
                console.log(payload.toString());
            });
        }
        //console.log(this.Client);
            //console.log("publicando...");

        this.data = [];
        this.data.push({
            cow_id:this.cow_id,
            param_id:this.param_id,
            value,
            datetime:"",
        });

        let obj = {
            user_id:this.user_id,
            data:this.data,
        }
        let strObj = JSON.stringify(obj);
        console.log(strObj);
        this.Client.publish(`${TOPIC}`, strObj, {qos:0, retain:false}); 
        
    }
    Connected(){
        //console.log("me conecté")
    }
    Disconnected(){
        //console.log("me desconecté")
    }
}
