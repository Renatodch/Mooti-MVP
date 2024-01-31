require("dotenv").config();
import getData from "./data";
import { MqttClient } from "mqtt";
import axios from "axios"
import {MootiData, Packet} from "./entity/MootiData"
import SourceMqttClient from "./types/SourceMqttClient";
import SourceHttpClient from "./types/SourceHttpClient"
import { delay, GetRandomSeconds, GetRandomValue } from "./utils/utils";
import readline from "readline"
const rL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let user_id = "arom"
let cows = ["a001","m001"];

(async function(){
    let d = new Date(2022,12-1,3,1,0,0);
    //let fulltime = Timestamp.fromDate(datetime)

    function recursiveReadLine(){
        rL.question("sendata?", async()=>{
            
            recursiveReadLine();
        })
    }
    recursiveReadLine();
    /*
    //AUTOMATE
    while(1){
        //d.setMinutes(d.getMinutes() + 1);
        d.setSeconds(d.getSeconds() + GetRandomSeconds(60))
        dateStr = `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}-${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        mooti = new MootiData(user_id,cows[0],"tcow",dateStr,GetRandomValue(38).toString());
        await device.Send(mooti);
        console.log(JSON.stringify(mooti));
        await delay(1000);
    }
    */
})();
