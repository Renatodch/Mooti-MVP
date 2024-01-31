import {Cow,_Cow} from "../Entities/Cow"
import {Entity} from "../Entities/Entity"
import {Response} from "../Entities/Response"
import { responses } from "../utils/responses";
import DataAccess from "../DataAccess/DataAccess";

class CowController{
    private static instance:CowController;
    private collectionName:string;

    private constructor(){
        this.collectionName = "cows";
    }
    public static getInstance():CowController{
        if(!CowController.instance){
            CowController.instance = new CowController();
        }
        return CowController.instance;
    }

    public DeleteCow=async(user_id:string, CowID:string):Promise<boolean>=>{
        let res:boolean = false;
        try {
            let query = this.QueryCowByCowIDAndUserID(CowID,user_id);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query);
            if(docs.length>0){
                let _id = docs[0].id;
                res= await DataAccess.getInstance().Delete(this.collectionName,_id);
            }   
        } catch (e) {
            console.log("Error: ",e)
        }
        return res;
    }
    public DeleteCowsByUser = async(user_id:string):Promise<boolean>=>{
        return new Promise<boolean>((resolve, reject) => {
            this.deleteCowsQueryBatch(user_id, resolve, reject);
        });
    }

    private deleteCowsQueryBatch = async(user_id:string, resolve: (value: boolean) => void, reject:(r?:any)=>void) => {
        try {
            const query = DataAccess.getInstance()
            .GetQueryOrderByLimit(this.collectionName,"user_id","==",user_id,"__name__",1);

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
                this.deleteCowsQueryBatch(user_id, resolve, reject);
            });   
        } catch (e) {
            console.log("Error: ",e)
            reject();
        }
    }

    public GetCows=async(user_id:string):Promise<Array<Entity<Cow>>>=>{
        let Cows: Array<Entity<Cow>> = new Array<Entity<Cow>>();
        const query = DataAccess.getInstance().GetQuery(this.collectionName,"user_id","==",user_id)
        await DataAccess.getInstance().GetDocs(this.collectionName, query)
        .then(docs=>{
            docs.forEach(d=>{
                Cows.push(new Entity<Cow>((d.data() as Cow), d.id))
            })
        })
        .catch(e=> {
            console.error("Error reading documents: ", e);
        })
        return Cows;
    }
   
    private ExistCow= async(_id:string):Promise<any>=>{
        let exist:boolean = false;
        try {
            const docRef = DataAccess.getInstance().GetDocRef(this.collectionName, _id)
            exist = (await DataAccess.getInstance().GetDocSnapShot(docRef)).exists();       
        } catch (e) {
            console.log("Error: ",e)
        }
        return exist;
    }
    public IsCowIDUnique = async(CowID:string, _id:string, user_id:string):Promise<boolean>=>{
        let exist:boolean = false;
        try {
            const query = this.QueryCowByCowIDAndUserID(CowID,user_id);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName, query)
            
            exist = !! docs.filter( (v,i)=>{
                return (v.id) != _id
            }).length
          
        } catch (e) {
            console.log("Error: ",e);
        }

        return exist;
    }
    private QueryCowByCowIDAndUserID = (CowID:string, user_id:string):any=>{
        return DataAccess.getInstance().GetQuery2(this.collectionName,"CowID","==",CowID,"user_id","==",user_id);
    }
    public ExistCowID= async(user_id:string, CowID:string):Promise<boolean>=>{
        let exist:boolean = false;
        try {
            const query = this.QueryCowByCowIDAndUserID(CowID,user_id);
            exist = !!(await DataAccess.getInstance().GetDocs(this.collectionName, query)).length;   
        } catch (e) {
            console.log("Error: ",e)
        }
        return exist;
    }
    public GetCowByID = async(user_id:string, CowID:string):Promise<Entity<Cow>>=>{
        let cow:Entity<Cow> = new Entity<Cow>(new Cow(), "");
        try {
            const query = this.QueryCowByCowIDAndUserID(CowID,user_id);
            const docs = await DataAccess.getInstance().GetDocs(this.collectionName,query)
            
            if(docs.length>0){
                cow.Data = docs[0].data() as Cow;
                cow._id = docs[0].id;
            }
        
        } catch (e) {
            console.log("Error: ",e)
        }

        return cow;
    }
   
    public SaveCow=async(body: Entity<Cow>, save:boolean = false):Promise<Response<Cow>>=>{
        let res:Response<Cow> = new Response<Cow>(new Entity<Cow>(new Cow(),"") , responses.SERVER_ERROR);
        
        let obj:Entity<Cow> = {
            Data : _Cow(body.Data as Cow),
            _id: body._id || ""
        }
        try {
            const existCowID = await this.IsCowIDUnique(obj.Data.CowID, obj._id, obj.Data.user_id);
            const existCow = await this.ExistCow(obj._id);
    
            if(existCowID){
                res.res = responses.ALREADY_EXIST;
            }
            else if(!save){
                await DataAccess.getInstance().Update(this.collectionName, obj.Data, obj._id);
                res.d.Data = obj.Data;
                res.d._id = obj._id,
                res.res = responses.SUCCESS_SAVE
            }
            else if(!existCow ){           
                res.d.Data = obj.Data;
                res.d._id = await DataAccess.getInstance().Save(this.collectionName,obj.Data);
                res.res = responses.SUCCESS_SAVE;    
            } 
        } catch (e) {
            console.log("Error: ",e);
        }
        
        return res;
    }


}


export default CowController
