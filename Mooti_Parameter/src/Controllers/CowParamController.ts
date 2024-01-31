import {Parameter,_Parameter} from "../Entities/Parameter"
import {Entity} from "../Entities/Entity"
import {Response} from "../Entities/Response"
import DataAccess from "../DataAccess/DataAccess";
import { responses } from "../utils/responses";
import { CowParam, _CowParam } from "../Entities/CowParam";
import { DocumentData, Query, Timestamp } from "firebase/firestore";
import ParameterController from "./ParameterController";
import CowController from "./CowController";
import { Cow } from "../Entities/Cow";

class CowParamController{
    private static instance:CowParamController;
    private collectionName:string;

    private constructor(){
        this.collectionName = "cowparam";
    }
    public static getInstance():CowParamController{
        if(!CowParamController.instance){
            CowParamController.instance = new CowParamController();
        }
        return CowParamController.instance;
    }

    public DeleteCowParamsByParameter=async(user_id:string, ParamID:string):Promise<boolean>=>{
        return new Promise<boolean>((resolve, reject) => {
            this.deleteCowParamQueryBatch(user_id, resolve,reject, undefined, ParamID);
        });
    }
    public DeleteCowParamsByCow=async(user_id:string, CowID:string):Promise<boolean>=>{
        return new Promise<boolean>((resolve, reject) => {
            this.deleteCowParamQueryBatch(user_id, resolve,reject, CowID, undefined);
        });
    }
    public DeleteCowParamsByUser = async(user_id:string):Promise<boolean>=>{
        return new Promise<boolean>((resolve, reject) => {
            this.deleteCowParamQueryBatch(user_id, resolve, reject);
        });
    }

    public deleteCowParamQueryBatch = async(user_id:string, resolve: (value: boolean) => void, reject:(r?:any)=>void, CowID?:string, ParamID?:string) => {
        let query;
        try {
            if(CowID === undefined && ParamID === undefined) 
                query = DataAccess.getInstance()
                .GetQueryOrderByLimit(this.collectionName,"user_id","==",user_id,"__name__",1);
            else if(CowID)
                query = DataAccess.getInstance()
                .GetQueryOrderByLimit2(this.collectionName,"user_id","==",user_id,"CowID","==",CowID,"__name__",1);
            else if(ParamID)
                query = DataAccess.getInstance()
                .GetQueryOrderByLimit2(this.collectionName,"user_id","==",user_id,"ParamID","==",ParamID,"__name__",1);
            else{
                console.log("nothing deleted!"); resolve(false);
            }

            const docs = await DataAccess.getInstance().GetDocs(this.collectionName, query);
            const batchSize = docs.length;

            if (batchSize === 0) {
                resolve(true);
                return;
            }        
            await DataAccess.getInstance().batchDelete(docs);
            
            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                this.deleteCowParamQueryBatch(user_id, resolve, reject, CowID, ParamID);
            });    
        } catch (e) {
            console.log("Error: ",e);
            reject();
        }
    }

    public test=async(obj:any):Promise<Array<Entity<CowParam>>>=>{
        //let CowParams: Array<Entity<CowParam>> = new Array<Entity<CowParam>>();
        let data: Array<Entity<any>> = new Array<Entity<any>>();
        let startDate:Timestamp = Timestamp.fromDate(new Date(obj.StartDate)); //+"Z"
        let endDate:Timestamp = Timestamp.fromDate(new Date(obj.EndDate)); 
        console.log(obj.StartDate)
        console.log(obj.EndDate)
        console.log(startDate)
        console.log(endDate)
        const query:Query<DocumentData> = DataAccess.getInstance().GetQueryForReport(
            this.collectionName,"user_id","==",obj.user_id,
            "CowID","==","v001",
            "ParamID","==","temp",
            "Datetime","<=",">=",endDate,startDate);
        
        //const query = DataAccess.getInstance().GetQuery("parameters","user_id","==","p001")

        //console.log(query)

        //const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query)
        await DataAccess.getInstance().GetDocs(this.collectionName,query)
        .then(docs =>{
            console.log("==================== docs ==================")
            //console.log(docs)
            console.log("first")
            console.log(docs.length)
            docs.forEach(d=>{
                console.log("iterando docs")
                let cp:CowParam = (d.data() as CowParam);
                //let da:Timestamp = new Timestamp(cp.Datetime.seconds, cp.Datetime.nanoseconds);
                //console.log(da.toDate())
                data.push(new Entity<any>({
                    user_id: cp.user_id,
                    Datetime: cp.Datetime,
                    Value: cp.Value,
                    CowID: cp.CowID,
                    ParamID: cp.ParamID,
                },d.id))
            })
        })

        
        return data;
    }

    public GetCowParamsForReport=async(obj:any):Promise<Array<Entity<CowParam>>>=>{
        //let CowParams: Array<Entity<CowParam>> = new Array<Entity<CowParam>>();
        let data: Array<Entity<any>> = new Array<Entity<any>>();
        let startDate:Timestamp = Timestamp.fromDate(new Date(obj.StartDate)); //+"Z"
        let endDate:Timestamp = Timestamp.fromDate(new Date(obj.EndDate)); 

        try {
            for(let cow_id of obj.Cows){
                for(let param_id of obj.Params){
                    //console.log(`${obj.StartDate} ${obj.EndDate} ${obj.user_id} ${obj.CowID} ${obj.ParamID} ${obj.StartDate} ${obj.EndDate}`)
                    const query:Query<DocumentData> = DataAccess.getInstance().GetQueryForReport(
                        this.collectionName,"user_id","==",obj.user_id,
                        "CowID","==",cow_id,
                        "ParamID","==",param_id,
                        "Datetime","<=",">=",endDate,startDate);
                    const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query)
                    let parameter = await ParameterController.getInstance().GetParameterByID(obj.user_id,param_id);
                    let v1:number,v2:number,v3:number;
                    //console.log(docs)
                    //console.log(docs.length)
                    if(docs.length>0){
                        docs.sort((a,b)=>(b.data() as CowParam).Datetime.toMillis() - (a.data() as CowParam).Datetime.toMillis())
                    }
                    docs.forEach(d=>{
                        let cp:CowParam = (d.data() as CowParam);
                        if(+cp.Value > parameter.Data.HighIndicator){
                            v3=1;v2=0;v1=0;
                        }else if(+cp.Value <= parameter.Data.HighIndicator && +cp.Value >= parameter.Data.LowIndicator){
                            v3=0;v2=1;v1=0;
                        }else if(+cp.Value < parameter.Data.LowIndicator){
                            v3=0;v2=0;v1=1;
                        }
                        //let da:Timestamp = new Timestamp(cp.Datetime.seconds, cp.Datetime.nanoseconds);
                        //console.log(da.toDate())
                        data.push(new Entity<any>({
                            user_id: cp.user_id,
                            Datetime: cp.Datetime,
                            Value: cp.Value,
                            CowID: cp.CowID,
                            ParamID: cp.ParamID,
                            v1,v2,v3
                        },d.id))
                    })
                }
            }
            
        } catch (e) {
            console.log("Error: ",e);
        }
        
        return data;
    }
    public GetCowParamsForDetail=async(user_id:string, CowID:string):Promise<Array<any>>=>{
        let CowParams: Array<any> = new Array<any>();
        try {
            const query = DataAccess.getInstance().GetQuery2(this.collectionName,"user_id","==",user_id,"CowID","==",CowID);

            let paramIdArr:string[] = []
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName, query)
            docs.forEach(d=>{
                let id = (d.data() as CowParam).ParamID;
                if(!paramIdArr.includes(id))
                    paramIdArr.push(id)
            });
    
            paramIdArr.forEach(id=>{
                let data = docs.filter(d=>(d.data() as CowParam).ParamID === id)
                .sort((a,b)=>((a.data() as CowParam).Datetime.toMillis() - (b.data() as CowParam).Datetime.toMillis()));
                let firstDataDate:Timestamp = (data[0].data() as CowParam).Datetime;
                let lastDataDate:Timestamp = (data[data.length-1].data() as CowParam).Datetime;
    
                let dataNotification1 = data.filter(d=>((d.data() as CowParam).TriggeredN & 0b001));
                let dataNotification2 = data.filter(d=>((d.data() as CowParam).TriggeredN & 0b010));
                let dataNotification3 = data.filter(d=>((d.data() as CowParam).TriggeredN & 0b100));
                CowParams.push(
                {
                    FirstDataDate: firstDataDate,
                    LastDataDate: lastDataDate,
                    ParamID:id,
                    NumData:data.length,
                    NumDataNotification1:dataNotification1.length,
                    NumDataNotification2:dataNotification2.length,
                    NumDataNotification3:dataNotification3.length
                });
            });    
        } catch (e) {
            console.log("Error: ",e);
        }
        
        return CowParams;
    }
    
    private BuildMessage = (template:string, obj:any):string =>{
        if(template == "") template = "Ninguno";
        return `*Notificacion de Parametro:  ${obj.ParamName} para Vaca:  ${obj.CowName}*\n${obj.Event}\nMensaje: ${template}`;
    }

    public SaveCowParam=async(body: Array<Entity<CowParam>>):Promise<any>=>{
        let arr: Array<any> = new Array();

        try {
            for(let e of body){  

                let obj:Entity<CowParam> = {
                    Data : _CowParam(e.Data as CowParam),
                    _id:  e._id
                }
                let eP:Entity<Parameter> = await ParameterController.getInstance().GetParameterByID(obj.Data.user_id, obj.Data.ParamID);
                let eC:Entity<Cow> = await CowController.getInstance().GetCowByID(obj.Data.user_id, obj.Data.CowID);
                
                if(eP._id == "" || eC._id == "") return ({res: responses.WRONG_IDS_ON_DATA,arr:[]});
                else if(!eP.Data.Active) return ({res: responses.PARAMETER_INACTIVE,arr:[]});
                else if(!eC.Data.Active) return ({res: responses.COW_INACTIVE,arr:[]});
                
                let template = "",type="",event="";
    
                if(+obj.Data.Value > eP.Data.HighIndicator && eP.Data.EnableN3){
                    obj.Data.TriggeredN = 0b100;
                    template = eP.Data.Message3;
                    event=`En ${eP.Data.ParamID} el valor ${obj.Data.Value} ${eP.Data.Unit} está por encima de ${eP.Data.HighIndicator} ${eP.Data.Unit} para ${eC.Data.CowID}`;
    
                }else if(+obj.Data.Value <= eP.Data.HighIndicator && +obj.Data.Value >= eP.Data.LowIndicator && eP.Data.EnableN2){
                    obj.Data.TriggeredN = 0b010;
                    template = eP.Data.Message2;
                    event = `En  ${eP.Data.ParamID} el valor ${obj.Data.Value} ${eP.Data.Unit} se encuentra entre ${eP.Data.HighIndicator} ${eP.Data.Unit} y ${eP.Data.LowIndicator} ${eP.Data.Unit} para ${eC.Data.CowID}`
    
                }else if(+obj.Data.Value < eP.Data.LowIndicator && eP.Data.EnableN1){
                    obj.Data.TriggeredN = 0b001;
                    template = eP.Data.Message1;
                    event=`En ${eP.Data.ParamID} el valor ${obj.Data.Value} ${eP.Data.Unit} por debajo de: ${eP.Data.LowIndicator} ${eP.Data.Unit} para ${eC.Data.CowID}`;
                }

                event += event != ""? ` el dia ${obj.Data.Datetime.toDate().toLocaleDateString()} a las ${obj.Data.Datetime.toDate().toLocaleTimeString()}` :""
                let triggered = obj.Data.TriggeredN;
    
                await DataAccess.getInstance().Save(this.collectionName,obj.Data)
                arr.push({
                    Triggered : triggered,
                    Message: this.BuildMessage(template, {
                        ParamID:obj.Data.ParamID,
                        ParamName:eP.Data.Name,
                        CowID:obj.Data.CowID,
                        CowName:eC.Data.Name,
                        Event:event,
                        Type: type,
                    })
                })
            } 

            return {
                res:responses.SUCCESS,
                arr:arr
            };
        } catch (e) {
            console.log("Error: ",e);
            return ({
                res: responses.UNEXPECTED_ERROR,
                arr:[]
            });
        }
    }
}


export default CowParamController
