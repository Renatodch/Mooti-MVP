import { cowParamMessages, responses } from "../utils/responses";
import { Server } from "socket.io";
import { Timestamp } from "firebase/firestore";
import { Entity } from "../Entities/Entity";
import { CowParam } from "../Entities/CowParam";
import BotController from "./BotController";
import axios from "axios";
import { URI_COW_PARAM, URI_USER_TELEGRAM, URL_PARAM_SERVICE, URL_USER_SERVICE, WEBSOCKETS_PORT } from "..";

const io = new Server(parseInt(WEBSOCKETS_PORT as string));
console.log("Websockets listo en el puerto "+parseInt(WEBSOCKETS_PORT as string))

io.on('connection', s=>{})
io.on("disconnect",()=>{})

export default class CowParamController{
    private static instance:CowParamController;
    private constructor(){

    }
    public static getInstance(){
        if(!this.instance){
            this.instance = new CowParamController()
        }
        return this.instance;
    }

    private IsValidFormat = (str:string):any=>{
        let req = null
        try{
            req = JSON.parse(str);
            //console.log(req)
            if((typeof( req.user_id) != "string") || !(req.data instanceof Array<any>) || Object.values(req).length != 2)
            {
                return null;
            }

            for(let e of req.data){
                if(     (typeof e.datetime != "string") ||  (typeof e.value != "string") || isNaN(e.value)
                    ||  (typeof e.cow_id != "string")   ||  (typeof e.param_id != "string") ||  Object.values(e).length != 4)
                {
                    return null
                }
                e.d = this.FixDate(e.datetime); 
                //console.log(e.d);
                if(isNaN(e.d.seconds)){
                    return null;
                }
            }
            return req;
        }catch (e){
            console.log("error: "+e)
            return null;
        }
    }    

    private GetTelegramUsersData = async(user_id:string): Promise<any>=>{
        let admin_res:responses | null = null;
        let users:any;
        let r:any;
        try{
            r = await axios.get(`${URL_USER_SERVICE}${URI_USER_TELEGRAM}/?user_id=${user_id}`);
            users=r.data?.d;
            admin_res=r.data?.res;
        }catch(e){
            console.error("Error: "+e);
        }
        return {users, admin_res};
    }

    ProcessSourceRequest= async(str:string)=>{
        let r:any;
        try{
            let req:any = this.IsValidFormat(str) 
            if(req == null ) return {res:cowParamMessages.messageWrongFormat};
            
            const {users, admin_res} = await this.GetTelegramUsersData(req.user_id);

            if(admin_res === null) return {res:cowParamMessages.messageSomeServicesDown}; 
            if(admin_res === responses.USER_DONT_EXIST) return {res:cowParamMessages.messageUserDontExist};
            if(admin_res === responses.USER_INACTIVE) return {res:cowParamMessages.messageUserInactive};
            if(admin_res === responses.USER_NOT_ADMIN) return {res:cowParamMessages.messageUserIsNotAdmin};

            const {arr, res} = this.BuildCowParam(req); 
            if(res === responses.UNEXPECTED_ERROR) return {res:cowParamMessages.messageWrongFormat}; 
            
            r = await axios.post(`${URL_PARAM_SERVICE + URI_COW_PARAM}`,arr);
            //console.log(r.data)
            if(r.data.res === undefined || r.data.res === responses.UNEXPECTED_ERROR) return {res:cowParamMessages.messageSomeServicesDown};      
            if(r.data.res === responses.WRONG_IDS_ON_DATA) return {res:cowParamMessages.messageIDsOnDataDontExist};           
            if(r.data.res === responses.PARAMETER_INACTIVE) return {res:cowParamMessages.messageParameterInactive};
            if(r.data.res === responses.COW_INACTIVE) return {res:cowParamMessages.messageCowInactive};
            
            if(r.data.res === responses.SUCCESS){
                arr.forEach((e:any)  => { io.emit(`${e.Data.user_id} ${e.Data.CowID} ${e.Data.ParamID}`,e); });

                let notify = false;
                users.forEach((user:any) => {
                    //console.log(user)  
                    if(user.Data.Active){
                        if(user.Data.TelegramUserActive){
                            r.data.arr.forEach(async (e:any)=>{
                                //console.log(e);
                                if(e.Triggered){
                                    notify = true;
                                    r = await BotController.getInstance().Send(e.Message,user.Data.ChatID);
                                }
                            });
                        }
                        //else console.log("Telegram user inactive: "+user._id)
                    }
                    //else console.log("User inactive: "+user._id)
                });


                return {res:notify ? cowParamMessages.messageSuccessAndNotify : cowParamMessages.messageSuccess};
            }
            return {res:responses.UNEXPECTED_ERROR}
        }catch(e){
            console.log("Error: "+e)
            return {res:cowParamMessages.messageSomeServicesDown};
        }
    }
    
    private BuildCowParam = (packet:any):any => {
        let res = responses.UNEXPECTED_ERROR;
        let arr:Array<Entity<CowParam>> = new Array<Entity<CowParam>>();
        let user_id = packet.user_id;
        try{
            for(let e of packet.data){               
                let obj:Entity<CowParam> = {
                    Data : {
                        user_id:user_id,
                        CowID: e.cow_id || "",
                        ParamID: e.param_id || "",
                        Datetime: e.d,
                        Value: +(+e.value).toFixed(2) || 0,
                        TriggeredN: 0,
                    },
                    _id: ""
                }
                arr.push(obj); 
            }
            res = responses.SUCCESS;
            //console.log({arr, res})
            return {arr, res};
        }
        catch(e){
            console.log("Error: "+e);
            res = responses.UNEXPECTED_ERROR;
            return {arr, res};
        }
    }

    private FixDate = (dtStr?:string):Timestamp =>{
        let datetime:Timestamp = new Timestamp(0,0);
        //let res = responses.UNEXPECTED_ERROR;
        try{
            if(dtStr){
                dtStr = dtStr.replace("-","T")
                dtStr = dtStr.replace(/[/]/g,"-")
                datetime = Timestamp.fromDate(new Date(dtStr));
            }else{
                datetime = Timestamp.now();
            }
            //console.log(datetime.toDate().toString())
            //res = responses.SUCCESS;
        }
        catch(e){
            console.log(e)
            //res = responses.UNEXPECTED_ERROR;
        }
        return datetime;
    }
}