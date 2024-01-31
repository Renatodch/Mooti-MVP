import SourceType from "../enums/source-type";
import ISource from "./device-interface";
import SourceHttpClient from "./types/SourceHttpClient";
import SourceMqttClient from "./types/SourceMqttClient";

export default class SourceFactory{
    public static createSourceType(type: SourceType, user_id:string, cow_id:string, param_id:string):ISource{
        if(type === SourceType.SourceMQTT){
            return new SourceMqttClient(user_id,cow_id,param_id);
        }
        if(type === SourceType.SourceHTTP){
            return new SourceHttpClient(user_id,cow_id,param_id);
        }

        throw new Error("Invalid source type");
    }
}