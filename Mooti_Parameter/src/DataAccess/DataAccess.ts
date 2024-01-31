import { Cow } from "../Entities/Cow";
import { db } from "./config"
import {collection,addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, writeBatch,
DocumentReference, query,where, DocumentData, DocumentSnapshot, Query, QueryDocumentSnapshot, WhereFilterOp, orderBy, limit, runTransaction, Timestamp, getDocsFromServer} from "firebase/firestore";
import {Entity} from "../Entities/Entity"
import {Response} from "../Entities/Response"
import { responses } from "../utils/responses";
import { response } from "express";


class DataAccess{
    private static instance: DataAccess;

    private constructor(){
    }
    public static getInstance():DataAccess{
        if(!DataAccess.instance){
            DataAccess.instance = new DataAccess();
        }
        return DataAccess.instance
    }

    public GetDocRef = (collection:string, _id:string):DocumentReference<DocumentData>=>{
        return doc(db, collection, _id==""?"new_id":_id);
    }
    public GetDocSnapShot = async(docRef:DocumentReference<DocumentData>):Promise<DocumentSnapshot<DocumentData>>=>{
        let doc:any;
        try {
            doc = await getDoc(docRef);   
        } catch (e) {
            console.log("Error: ",e);
        }
        return doc;
    }
    
    public Update = async(collection:string, data:any,id:string)=>{
        try {
            await setDoc(doc(db, collection, id), data)    
        } catch (e) {
            console.log("Error: ",e)
        }
    }
    public Save = async(collectionName:string,data:any):Promise<string>=>{
        let id:string = "";
        try {
            id = (await addDoc(collection(db,collectionName),data))?.id;   
        } catch (e) {
            console.log("Error: ",e)
        }
        return id;
    }

    public Delete = async(collection:string, _id:string):Promise<boolean>=>{
        let res:boolean = false;
        try {
            await deleteDoc(doc(db, collection, _id))
            res = true;  
        } catch (e) {
            console.log("Error: ",e)
        }
        return res;
    }

    public GetQuery =(collectionName:string, field:string,cond:string, value:string):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field,cond as WhereFilterOp,value));
    }
    public GetQuery2 =(collectionName:string, field:string,cond:string, value:string,field2:string,cond2:string, value2:string):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field,cond as WhereFilterOp,value)
        ,where(field2,cond2 as WhereFilterOp,value2))
    }
    public GetQueryForReport =(collectionName:string,
        field1:string,cond1:string,value1:string,
        field2:string,cond2:string,value2:string,
        field3:string,cond3:string,value3:string,
        field4:string,cond4:string,cond5:string, value4:Timestamp, value5:Timestamp):Query<DocumentData>=>{
        return query(collection(db,collectionName),
        where(field1,cond1 as WhereFilterOp,value1),
        where(field2,cond2 as WhereFilterOp,value2),
        where(field3,cond3 as WhereFilterOp,value3),
        where(field4,cond4 as WhereFilterOp,value4),
        where(field4,cond5 as WhereFilterOp,value5))
    }
    public GetQueryOrderByLimit = (collectionName:string, field:string,cond:string, value:string, orderby:string, lim:number):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field, cond as WhereFilterOp, value)
        ,orderBy(orderby)
        ,limit(lim))
    } 
    public GetQueryOrderByLimit2 = 
    (collectionName:string, field:string,cond:string, value:string,field2:string,cond2:string, value2:string, orderby:string, lim:number):Query<DocumentData>=>{
        return query(collection(db,collectionName)
        ,where(field, cond as WhereFilterOp, value)
        ,where(field2, cond2 as WhereFilterOp, value2)
        ,orderBy(orderby)
        ,limit(lim))
    } 
    

    public GetDocs = async(collectionName:string, query?: Query<DocumentData>):Promise<Array<QueryDocumentSnapshot<DocumentData>>>=>{
        let docs:Array<QueryDocumentSnapshot<DocumentData>> = new Array<QueryDocumentSnapshot<DocumentData>>();
        
        try {
            let res = await getDocs(!query? collection(db, collectionName) : query);  
            return res?.docs;
        }catch (e) {
            console.log("Error: ",e);
            return [];
        }
    }

    public batchDelete = async (docs: QueryDocumentSnapshot<DocumentData>[])=>{
        const batch = writeBatch(db);
        docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }

    
}

export default DataAccess
