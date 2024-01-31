import { db} from "./config"
import {collection,addDoc, getDocs, getDoc, doc, setDoc, deleteDoc, writeBatch,
DocumentReference, query,where, DocumentData, DocumentSnapshot, Query, QueryDocumentSnapshot, WhereFilterOp, orderBy, limit, runTransaction} from "firebase/firestore";
import { Cow, _Cow } from "../entity/Cow";

const collectionCowParam = "cowparam"
const collectionCow = "cows"


async function CreateCows(cows:Array<Cow>){
    return new Promise((resolve,reject)=>{
        saveCowQueryBatch(resolve,cows);
    })

    /*
    for(let cow of cows){        
        let obj = {
            Data : _Cow(cow as Cow),
            _id: ""
        }
          
        let id:string = "";
        await addDoc(collection(db,collectionCow),obj.Data)
        .then(ref => {
            id = ref.id;
        })
        .catch(e=>console.error("Error: ", e))
    }
    */
}

function DeleteCowsByUser(user_id:string){
    return new Promise<boolean>((resolve,reject)=>{
        deleteCowQueryBatch(resolve, user_id).catch(reject);
    })
}

function DeleteAllCowParams(){
    return new Promise<boolean>((resolve,reject)=>{
        deleteQueryBatch(resolve).catch(reject);
    })
}
function DeleteCowParamsByUser(user_id:string){
    return new Promise<boolean>((resolve,reject)=>{
        deleteQueryBatch(resolve, user_id).catch(reject);
    })
}
function GetCowParamsByUser2Query(user_id:string, CowID:string):Query<DocumentData>{
    return query(collection(db,collectionCowParam),
    where("user_id","==",user_id))
}
function GetCowsByUserQuery(user_id:string):Query<DocumentData>{
    return query(collection(db,collectionCow),where("user_id","==",user_id),orderBy("__name__"),limit(100))
}
function GetCowParamsByUserQuery(user_id:string):Query<DocumentData>{
    return query(collection(db,collectionCowParam),where("user_id","==",user_id),orderBy("__name__"),limit(100))
}
function GetCowParamsByCowQuery (user_id:string, CowID:string):Query<DocumentData>{
    return query(collection(db,collectionCowParam),
    where("user_id","==",user_id),
    where("CowID","==",CowID),
    orderBy("__name__"),limit(100))
}
function GetCowParamsByParameterQuery(user_id:string, ParamID:string):Query<DocumentData>{
    return query(collection(db,collectionCowParam),
    where("user_id","==",user_id),
    where("ParamID","==",ParamID),
    orderBy("__name__"),limit(100))
}

async function GetCowParamDocs(collectionName:string , query?: Query<DocumentData>):Promise<QueryDocumentSnapshot<DocumentData>[]>{
    let docs = (await getDocs(query == undefined ? collection(db,collectionName) : query))?.docs       
    return docs;
}

async function deleteQueryBatch (resolve: (value: boolean) => void, user_id?:string, CowID?:string, ParamID?:string){
    let query = undefined;
    if(CowID === undefined && ParamID === undefined && user_id) {
        query = GetCowParamsByUserQuery(user_id as string)
        console.log(`borrando datos de fuentes iot por user_id= ${user_id}...`)
    }else if(CowID && user_id && ParamID === undefined){
        query = GetCowParamsByCowQuery(user_id,CowID)
        console.log(`borrando datos de fuentes iot por user_id= ${user_id} y CowID=${CowID}...`)
    }else if(ParamID && user_id && CowID === undefined){
        query = GetCowParamsByParameterQuery(user_id,ParamID)
        console.log(`borrando datos de fuentes iot por user_id= ${user_id} y ParamID=${ParamID}...`)
    }else{
        console.log(`borrando todos los datos de fuentes iot...`)
    }

    const docs = await GetCowParamDocs(collectionCowParam, query);
    const batchSize = docs.length;

    if (batchSize === 0) {
        resolve(true);
        return;
    }        
    const batch = writeBatch(db);
    docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch( resolve, user_id, CowID, ParamID);
    });
}

async function deleteCowQueryBatch (resolve: (value: boolean) => void, user_id?:string){
    let query = undefined;
    if(user_id) {
        query = GetCowsByUserQuery(user_id as string);
        console.log(`borrando vacas por user_id= ${user_id}...`)
    }else{
        console.log(`borrando todas las vacas...`)
    }

    const docs = await GetCowParamDocs(collectionCow, query);
    const batchSize = docs.length;

    if (batchSize === 0) {
        resolve(true);
        return;
    }        
    const batch = writeBatch(db);
    docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteCowQueryBatch( resolve, user_id);
    });
}

async function saveCowQueryBatch (resolve: (value: boolean) => void, cows:Array<Cow>){
    
    const batch = writeBatch(db);
    for(let cow of cows){
        let obj = {
            Data : _Cow(cow as Cow),
            _id: ""
        }
       
        batch.set(doc(db, collectionCow, `c_o_w_${cows.indexOf(cow)+1}`),obj.Data);
    }
    await batch.commit();
    console.log(`se crearon ${cows.length} vacas`)

    resolve(true);
    return;
}

export {
    CreateCows,
    DeleteCowsByUser,
    DeleteAllCowParams,
    DeleteCowParamsByUser,
}