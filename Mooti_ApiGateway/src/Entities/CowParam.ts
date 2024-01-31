import { Timestamp } from "firebase/firestore";

const _CowParam = (cowparam?: CowParam)=>{
    return{
        user_id : cowparam?.user_id || "",
        Datetime :  cowparam?.Datetime ? new Timestamp (cowparam.Datetime.seconds, cowparam.Datetime.nanoseconds) :  new Timestamp(0,0),
        Value : cowparam?.Value ? +cowparam?.Value : 0,
        CowID : cowparam?.CowID || "",
        ParamID : cowparam?.ParamID || "",
        TriggeredN: cowparam?.TriggeredN ? +cowparam?.TriggeredN : 0,

        /*
        TriggeredN1 : cowparam?.TriggeredN1 || false,
        TriggeredN2 : cowparam?.TriggeredN2 || false,
        TriggeredN3 : cowparam?.TriggeredN3 || false,
        */
    };
}
class CowParam{
    user_id:string = "";
    Datetime:Timestamp = new Timestamp(0,0);
    Value:number = 0;
    CowID:string = "";
    ParamID:string = "";
    TriggeredN:number = 0;
    /*
    TriggeredN1:boolean = false;
    TriggeredN2:boolean = false;
    TriggeredN3:boolean = false;
    */
    constructor(){}
 
}

export {CowParam, _CowParam}