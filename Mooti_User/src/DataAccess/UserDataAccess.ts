import { User } from "../Entities/User";
import { db} from "./config"
import {collection,addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, 
DocumentReference, query,where, DocumentData, Query, QuerySnapshot, QueryDocumentSnapshot, WhereFilterOp, DocumentSnapshot, FieldPath, orderBy, limit, writeBatch} from "firebase/firestore";
import {Entity} from "../Entities/Entity"


class UserDataAccess{
    private static instance: UserDataAccess;
    private collectionName:string;

    private constructor(){
        this.collectionName = "users";
    }
    public static getInstance():UserDataAccess{
        if(!UserDataAccess.instance){
            UserDataAccess.instance = new UserDataAccess();
        }
        return UserDataAccess.instance
    }

    public GetUserDocRef = (_id:string):DocumentReference<DocumentData>=>{
        return doc(db, this.collectionName, _id==""?"new_id":_id);
    }
    public GetUserDocSnapShot = async(docRef:DocumentReference<DocumentData>):Promise<DocumentSnapshot<DocumentData>>=>{
        let doc:any;
        try {
            doc = await getDoc(docRef);
        } catch (e) {
            console.log("Error: ",e)
        }
        return doc;
    }


    public SaveUser = async(obj:Entity<User>)=>{
        /*
        if(obj.Data.Type==2 || obj.Data.Type==3){
            await setDoc(doc(db,this.collectionName,obj.Data.parent_id,this.collectionName,obj._id),obj.Data)
            
        }else{
            */
        try {
            await setDoc(doc(db,this.collectionName,obj._id),obj.Data)
        } catch (e) {
            console.log("Error: ",e)   
        }
    
    }

    public DeleteUser = async(_id:string):Promise<boolean>=>{
        let res:boolean = false;
        try{
            await deleteDoc(doc(db, this.collectionName, _id));
            res = true;
        }catch(e){
            console.log("Error: ",e)
        }
        return res;
    }

    
    public batchDelete = async (docs: QueryDocumentSnapshot<DocumentData>[])=>{
        const batch = writeBatch(db);
        docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

    public GetUserQuery =(field:string,cond:string, value:any):Query<DocumentData>=>{
        return query(collection(db,this.collectionName),where(field,cond as WhereFilterOp,value)) 
    }
    public GetQueryOrderByLimit = (field:string,cond:string, value:string, orderby:string, lim:number):Query<DocumentData>=>{
        return query(collection(db,this.collectionName)
        ,where(field, cond as WhereFilterOp, value)
        ,orderBy(orderby)
        ,limit(lim))
    } 
    
    public GetUserDocs = async(query?: Query<DocumentData>):Promise<QueryDocumentSnapshot<DocumentData>[]>=>{
        let docs:any;
        try {
            docs = (await getDocs(query == null ? collection(db,this.collectionName) : query))?.docs          
        } catch (e) {
            console.log("Error: ",e);
        }
        return docs;
    }
}

export default UserDataAccess
