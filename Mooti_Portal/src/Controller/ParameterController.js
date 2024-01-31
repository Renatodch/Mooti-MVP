import { paths } from "../utils/responses";


let url_param = paths.GATEWAY_HTTP_URL + paths.URI_PARAM
let url_cowparam = paths.GATEWAY_HTTP_URL + paths.URI_COWPARAM
let url_cow = paths.GATEWAY_HTTP_URL + paths.URI_COW





const SaveParameter = async(Parameter, newObjFlag)=>{
    try{
        const body = JSON.stringify(Parameter)
        const settings = {
            method: newObjFlag?'POST':'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        };

        const response = await fetch(url_param, settings)
        //console.log(response.body);
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}


const DeleteParameter = async(user_id,ParamID)=>{
    try{
        const urlPath = `${url_param}?user_id=${user_id}&ParamID=${ParamID}`;
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/x-www-form-urlencoded',
                "origin":"*",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Access-Control-Allow-Origin":"*"
            },
        };
        
        const response = await fetch(urlPath, settings)
        //console.log(response.body);
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}

const GetParameters = async(user_id)=>{
    let query = `${url_param}?user_id=${user_id}`
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(query,settings)
        const data = await response.json();

        return data;
    }
    catch(error){
        return 0;
    }
}
const GetParameter = async(_id)=>{
    let query = `${url_param}?_id=${_id}`
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(query,settings)
        const data = await response.json();

        return data;
    }
    catch(error){
        return 0;
    }
}



const SaveCow = async(Cow, newObjFlag)=>{
    try{
        const body = JSON.stringify(Cow)
        const settings = {
            method: newObjFlag?'POST':'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        };
        const response = await fetch(url_cow, settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}

const DeleteCow = async(user_id, CowID)=>{
    try{
        const urlPath = `${url_cow}?user_id=${user_id}&CowID=${CowID}`;
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/x-www-form-urlencoded',
                "origin":"*",
                'Content-Type': 'application/x-www-form-urlencoded',
                "Access-Control-Allow-Origin":"*"
            },
        };
        
        const response = await fetch(urlPath, settings)
        //console.log(response.body);
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}
const GetCows = async(user_id)=>{
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(`${url_cow}?user_id=${user_id}`,settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}
const GetCowParamsForDetail = async(user_id, CowID)=>{
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(`${url_cowparam}?user_id=${user_id}&CowID=${CowID}`,settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}

const GetCowParamsForReport = async(Cows, Params, user_id, StartDate, EndDate)=>{
    try{
        let obj ={
            user_id,Cows,Params,StartDate,EndDate
        }
        let URL = url_cowparam+"/report"
        const body = JSON.stringify(obj)
        console.log(body);
        
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body
        };
        const response = await fetch(URL,settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}
export {GetParameters,GetParameter,DeleteParameter,SaveParameter,GetCowParamsForReport,
        GetCows,SaveCow,DeleteCow, GetCowParamsForDetail}

