import axios from "axios";
import ISource from "../device-interface";

const HTTP_ENDPOINT = process.env.HTTP_ENDPOINT || "";

export default class SourceHttpClient implements ISource{
    data : Array<any>;

    constructor(
        public user_id:string,
        public cow_id:string,
        public param_id:string
    ){
        this.data = Array<any>()
    }

    AddPacket = (packet:any):void =>{
        this.data.push(packet);
    }

    Connect = ()=>{}
    
    Send = async(datetime:string, value:string)=>{
        this.data = [];
        this.data.push({
            cow_id:this.cow_id,
            param_id:this.param_id,
            value,
            datetime:"",
        });

        try{
            let config = {
                headers :{
                    'content-type':'text/plain'//'application/json'
                }
            };
            let obj = {
                user_id : this.user_id,
                data: this.data,
            }
            let strObj = JSON.stringify(obj);
            //strObj=`{"wd":"Reanto","ds}`
            console.log(strObj);
            let r = await axios.post(HTTP_ENDPOINT, strObj, config);
            console.log(r?.data);
            return r;
        }catch(e){
            console.log("Error: "+e)
        }
    }
    
}

