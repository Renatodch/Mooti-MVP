import {Parameter,_Parameter} from "../Entities/Parameter"
import {Entity} from "../Entities/Entity"
import {Response} from "../Entities/Response"
import { responses } from "../utils/responses";
import DataAccess from "../DataAccess/DataAccess";

class ParameterController{
    private static instance:ParameterController;
    private collectionName:string;

    private constructor(){
        this.collectionName = "parameters";
    }
    public static getInstance():ParameterController{
        if(!ParameterController.instance){
            ParameterController.instance = new ParameterController();
        }
        return ParameterController.instance;
    }

    public DeleteParameter=async(user_id:string, ParamID:string):Promise<boolean>=>{
        let res:boolean = false;
        try {
            let query =this.QueryParamByParamIDAndUserID(ParamID,user_id);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName, query);
            if(docs.length>0){
                let _id = docs[0].id;
                res= await DataAccess.getInstance().Delete(this.collectionName, _id);
            }  
        } catch (e) {
            console.error("Error: ", e);  
        }

        return res;
    }
    public DeleteParametersByUser = async(user_id:string):Promise<boolean>=>{
        return new Promise<boolean>((resolve, reject) => {
            this.deleteParmeterQueryBatch(user_id, resolve, reject);
        });
    }
    public deleteParmeterQueryBatch = async(user_id:string, resolve: (value: boolean) => void, reject:(reason?:any)=>void) => {
        try {
            const query = DataAccess.getInstance()
            .GetQueryOrderByLimit(this.collectionName,"user_id","==",user_id,"__name__",1);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query);
            const batchSize = docs.length;
    
            if (batchSize === 0) {
                resolve(true);
                return;
            }
            
            await DataAccess.getInstance().batchDelete(docs);
            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                this.deleteParmeterQueryBatch(user_id, resolve, reject);
            }); 
        } catch (e) {
            console.error("Error: ", e)
            reject();    
        }

    }
    public GetParameters=async(user_id:string):Promise<Array<Entity<Parameter>>>=>{
        let Parameters: Array<Entity<Parameter>> = new Array<Entity<Parameter>>();
        const query = DataAccess.getInstance().GetQuery(this.collectionName,"user_id","==",user_id)
        try {
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query);
            docs.forEach(d=>{
                let param = (d.data() as Parameter);
                Parameters.push(new Entity<Parameter>(param, d.id))
            })
        } catch (e) {
            console.error("Error: ", e); 
        }
        
        return Parameters;
    }
    public GetParameter=async(_id:string):Promise<Entity<Parameter>>=>{
        let res:Entity<Parameter> = new Entity<Parameter>(new Parameter(),"");
        try {
            let docRef = DataAccess.getInstance().GetDocRef(this.collectionName,_id);
            let ref = await DataAccess.getInstance().GetDocSnapShot(docRef);
            let currentParam:Parameter = (ref.data() as Parameter)
            res.Data = currentParam;
            res._id = _id; 
        } catch (e) {
            console.error("Error: ", e);   
        }
        
        return res;
    }
    public GetParameterByID=async(user_id:string,ParamID:string):Promise<Entity<Parameter>>=>{
        let res:Entity<Parameter> = new Entity<Parameter>(new Parameter(),"");

        try {
            const query = this.QueryParamByParamIDAndUserID(ParamID,user_id);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName, query)
            if(docs.length > 0){
                res.Data = (docs[0].data() as Parameter);
                res._id = docs[0].id;
            }
        } catch (e) {
            console.error("Error reading documents: ", e);
        }
        return res;
    }
    
    private QueryParamByParamIDAndUserID = (ParamID:string, user_id:string):any=>{
        return DataAccess.getInstance().GetQuery2(this.collectionName,"ParamID","==",ParamID,"user_id","==",user_id);
    }
    private ExistParameter= async(_id:string):Promise<any>=>{
        let exist:boolean = false;

        try {
            const docRef = DataAccess.getInstance().GetDocRef(this.collectionName, _id)
            exist = (await DataAccess.getInstance().GetDocSnapShot(docRef)).exists();
        } catch (e) {
            console.log("Error: ",e);
        }

        return exist;
    }
    private ExistParamID= async(ParamID:string, _id:string, user_id:string):Promise<boolean>=>{
        let exist:boolean = false;

        try {
            const query = this.QueryParamByParamIDAndUserID(ParamID,user_id);
            const docs =  await DataAccess.getInstance().GetDocs(this.collectionName, query)
            exist = !! docs.filter( (v,i)=>{
                return (v.id) != _id
            }).length;
        } catch (e) {
            console.error("Error: ", e);
        }

        return exist;
    }
   
    public SaveParameter=async(body: Entity<Parameter>, save:boolean = false):Promise<Response<Parameter>>=>{
        let res:Response<Parameter> = new Response<Parameter>(new Entity<Parameter>(new Parameter(),"") , responses.SERVER_ERROR);
        
        let obj:Entity<Parameter> = {
            Data : _Parameter(body.Data as Parameter),
            _id: body._id || ""
        }

        try {
            const existParamID = await this.ExistParamID(obj.Data.ParamID, obj._id, obj.Data.user_id);
            const existParameter = await this.ExistParameter(obj._id);

            if(existParamID){
                res.res = responses.ALREADY_EXIST
            }
            else if(!save){
                await DataAccess.getInstance().Update(this.collectionName,obj.Data, obj._id);
                res.d.Data = obj.Data;
                res.d._id = obj._id,
                res.res = responses.SUCCESS_SAVE
            }else if(!existParameter){
                res.d._id = await DataAccess.getInstance().Save(this.collectionName,obj.Data)
                res.d.Data = obj.Data
                res.res = responses.SUCCESS_SAVE;
            }
        } catch (e) {
            console.error("Error: ", e);
        }
        return res;
    }

}


export default ParameterController
