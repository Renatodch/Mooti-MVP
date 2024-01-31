require("dotenv").config();
import SourceFactory from "./device-factory";
import SourceType from "../enums/source-type";
import * as utils from "./utils/utils"
import ISource from "./device-interface";

let numberOFPackets = 10;
let ts = 10000;

let d:Date = new Date(2022,12-1,9,2,0,0);

let sources:Array<ISource> = new Array<ISource>();
let sourceHTTP:ISource;

//let source2 = SourceFactory.createSourceType(SourceType.SourceMQTT, "arom","v001", "temp");

sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "temp"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "temp"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "resp"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "resp"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "resp"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v002", "step"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v002", "step"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v002", "pc"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v002", "pc"));
sources.push(SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v002", "pc"));

sourceHTTP = SourceFactory.createSourceType(SourceType.SourceHTTP, "arom", "v001", "pc");

async function MqTTLoop(){
    ConnectSources();
    await utils.delay(ts);
    SendSourcesData();
    await utils.delay(ts);
}

async function HTTPLoop(){
    SendSourcesData();
    await utils.delay(ts);
}
//MqTTLoop();
HTTPLoop();
function SendSourcesData(){
    for(let i = 0; i< numberOFPackets; i++){         
      sources[i].Send(utils.BuildDate(d),utils.GetRandomValue(50));       
    }
    //sources[100].Send(utils.BuildDate(d),utils.GetRandomValue(37));       
}
function ConnectSources(){
    for(let i = 0; i< numberOFPackets; i++){         
      sources[i].Connect();       
    }
}







/*
async function HTTPLoop(){
    sourceHTTP.Send(utils.BuildDate(d),utils.GetRandomValue(90));       
    await utils.delay(ts);
}
*/