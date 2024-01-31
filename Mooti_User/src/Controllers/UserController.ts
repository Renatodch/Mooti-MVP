import {TelegramUser, User, _User} from "../Entities/User"
import {Entity} from "../Entities/Entity"
import {Response} from "../Entities/Response"
import { responses } from "../utils/responses";
import UserDataAccess from "../DataAccess/UserDataAccess";
import { DocumentData, DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

class UserController{
    private static instance:UserController;

    private constructor(){}
    public static getInstance():UserController{
        if(!UserController.instance){
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }

    public GetUsers=async(user_id?: string, type?: string):Promise<Array<Entity<User>>>=>{
        let Users: Array<Entity<User>> = new Array<Entity<User>>();
        let user : Entity<User> = new Entity<User>(new User(), "");
        let query;
        switch(type){
            case "0":
                query = UserDataAccess.getInstance().GetUserQuery("Type","<=",1);
            break;
            case "1":        
                query = UserDataAccess.getInstance().GetUserQuery("parent_id","==",user_id || ""); //parent_id
                user = await this.GetUser(user_id || "");
            break;
        }
        
        try {
            const docs =  await UserDataAccess.getInstance().GetUserDocs(query)
            docs.forEach(d=>{
                Users.push(new Entity<User>((d.data() as User),d.id))
            })
            if(user._id != "")
                Users.push(user);
        } catch (e) {
            console.error("Error reading documents: ", e);
        }
        
        return Users;
    }
    public GetUser=async(user_id:string):Promise<Entity<User>>=>{
        let obj: Entity<User> = new Entity<User>(new User(),"");

        try{
            const doc = await this.GetUserSnapshot(user_id);
            if(doc.exists()){
                obj.Data = doc.data() as User;
                obj._id = doc.id;
            }
        }catch(e){
            console.error("Error reading documents: ", e);
        }

        /*
        await this.GetUserSnapshot(user_id)
        .then(doc=>{
            if(doc.exists()){
                obj.Data = doc.data() as User;
                obj._id = doc.id;
            }
        })
        .catch(e=> {
            console.error("Error reading documents: ", e);
        })
        */
        return obj;
    }
    
   
    private GetUserSnapshot= async(_id:string):Promise<DocumentSnapshot<DocumentData>>=>{
        let docRef:DocumentReference<DocumentData> = UserDataAccess.getInstance().GetUserDocRef(_id)
        let snapshot = await UserDataAccess.getInstance().GetUserDocSnapShot(docRef);
        return snapshot;
    }

    
    public SaveUser=async(body: Entity<User>, save:boolean = true):Promise<Response<User>>=>{
        let res:Response<User> = new Response<User>(new Entity<User>(new User(),"") , responses.SERVER_ERROR);

        let obj:Entity<User> = {
            Data : _User(body.Data as User),
            _id: body._id || ""
        }
        
        const snapshot= await this.GetUserSnapshot(obj._id);
        
        if(!snapshot.exists() || !save){

            if(!save && snapshot.exists()){
                let user: User = snapshot.data() as User;   
                if(user.TelegramUserID != obj.Data.TelegramUserID){
                    obj.Data.ChatID="";
                    obj.Data.TelegramUserActive = false;
                }
            }

            try {
                await UserDataAccess.getInstance().SaveUser(obj)
                res.d.Data = obj.Data
                res.d._id = obj._id
                res.res = responses.SUCCESS_SAVE;
            } catch (e) {
                console.log("Error: ",e)
            }
            /*
            await UserDataAccess.getInstance().SaveUser(obj)
            .then(e=>{
                res.d.Data = obj.Data
                res.d._id = obj._id
                res.res = responses.SUCCESS_SAVE;
            })
            .catch(e=>{
                console.log("Error: ",e)
            })
            */      
        }else{
            res.res = responses.ALREADY_EXIST;
        }
        return res;
    }
    public DeleteUser=async(_id:string):Promise<boolean>=>{
        let res:boolean = false;
        try{
            const docRef = UserDataAccess.getInstance().GetUserDocRef(_id);

            if( (await UserDataAccess.getInstance().GetUserDocSnapShot(docRef)).exists()){
                res = await UserDataAccess.getInstance().DeleteUser(_id);
                return res? new Promise<boolean>((resolve,reject)=>{
                    this.deleteUsersQueryBatch(_id, resolve,reject);
                }): false;
            }
        }catch(e){
            console.log("Error: ",e)
        }

        return res;
    }

    public deleteUsersQueryBatch = async(parent_id:string, resolve: (value: boolean) => void, reject:(reason?:any)=>void) => {
        try {
            const query = UserDataAccess.getInstance()
            .GetQueryOrderByLimit("parent_id","==",parent_id,"__name__",1);
            const docs = await UserDataAccess.getInstance().GetUserDocs(query);
            const batchSize = docs.length;
    
            if (batchSize === 0) {
                resolve(true);
                return;
            }
            
            await UserDataAccess.getInstance().batchDelete(docs);
            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                this.deleteUsersQueryBatch(parent_id, resolve, reject);
            }); 
        } catch (e) {
            console.error("Error: ", e)
            reject();    
        }
    }

    private GetQueryValidation=async (user_id:string, pass:string):Promise<Entity<User>>=>{
        let entity: Entity<User> = new Entity<User>(new User(),"");
        try {
            const docRef = UserDataAccess.getInstance().GetUserDocRef(user_id)
            let snapshot = await UserDataAccess.getInstance().GetUserDocSnapShot(docRef);
            if(snapshot.exists()){
                let user:User = (snapshot.data() as User)
                if(user.Password == pass){
                    entity.Data = user;
                    entity._id = user_id
                }
            }   
        } catch (e) {
            console.log("Error: ",e);
        }
        //const p = query(collection(db,this.collectionName),where(FieldPath,"==",user),where("Password","==",pass))
        return entity;
    }
    public ValidateUser =async(user:string,pass:string):Promise<Response<User>>=>{
        let res:Response<User> = new Response<User>(new Entity<User>(new User(),"") , responses.FAILED_LOGIN);       

        try {
            const entity:Entity<User> = await this.GetQueryValidation(user,pass);
            if(entity._id != ""){
                res.res = responses.SUCCESS_LOGIN;
                res.d.Data = entity.Data;
                res.d._id = entity._id
            }   
        } catch (e) {
            console.log("Error: ",e)
        }
        return res;
    }

    public ActivateTelegramUser= async(user_id:string, TelegramUserID:string, ChatID:string):Promise<Response<User>>=>{
        let res:Response<User> = new Response<User>(new Entity<User>(new User(),"") , responses.SERVER_ERROR); 
        
        let query = UserDataAccess.getInstance().GetUserQuery("TelegramUserID","==",TelegramUserID);
        let docs = await UserDataAccess.getInstance().GetUserDocs(query);
        let users = docs.filter(d=>(d.data() as User).TelegramUserActive);
        if(users.length > 0){
            res.res = responses.ALREADY_EXIST;
            res.d.Data = users[0].data() as User;
            res.d._id = users[0].id;
        }else{

            let userDocRef = UserDataAccess.getInstance().GetUserDocRef(user_id);
            let snapshot = await UserDataAccess.getInstance().GetUserDocSnapShot(userDocRef)
            if(snapshot.exists()){              

                let obj:Entity<User> = {
                    _id : snapshot.id,
                    Data : (snapshot.data() as User),
                }
                if(TelegramUserID == obj.Data.TelegramUserID){
                    obj.Data.ChatID = ""+ChatID;
                    obj.Data.TelegramUserActive = true;
                    //console.log(obj.Data)
                    try {
                        await UserDataAccess.getInstance().SaveUser(obj)
                        res.d.Data = obj.Data;
                        res.d._id = obj._id;
                        res.res = responses.SUCCESS_SAVE;
                    } catch (e) {
                        res.res = responses.SERVER_ERROR;

                    }
  
                }else{
                    res.d._id = obj._id;
                    res.res = responses.TELEGRAM_USER_DONT_EXIST;
                }
            }else{
                res.d._id = user_id;
                res.res = responses.USER_DONT_EXIST;
            }
        }

        return res;
    }

    public GetTelegramUsers= async(user_id:string)=>{
        let Users: Array<Entity<User>> = new Array<Entity<User>>();
        let docref = UserDataAccess.getInstance().GetUserDocRef(user_id);
        let snapshot = await UserDataAccess.getInstance().GetUserDocSnapShot(docref);
        let user:Entity<User> = new Entity<User>(new User(), "");
        let res:responses = responses.UNEXPECTED_ERROR;

        if(snapshot.exists()){
            user = {Data:snapshot.data() as User,_id:snapshot.id};
            if(user.Data.Type == 2 || user.Data.Type == 3){
                res = responses.USER_NOT_ADMIN;
                return {d:Users,res:res};
            }
            if(!user.Data.Active){
                res = responses.USER_INACTIVE;
                return {d:Users,res:res};
            }
            Users.push(user);
            
            let query = UserDataAccess.getInstance().GetUserQuery("parent_id","==",user._id);

            try {
                const docs = await UserDataAccess.getInstance().GetUserDocs(query);
                docs.forEach(d=>{
                    Users.push(new Entity<User>((d.data() as User),d.id))
                })
                res = responses.SUCCESS;
            } catch (e) {
                console.error("Error reading documents: ", e);
            }
    
        }else{
            res = responses.USER_DONT_EXIST
            Users.push(user);
        }
        return {d:Users,res:res};
    }

}


export default UserController
