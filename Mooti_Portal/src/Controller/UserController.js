import { paths } from "../utils/responses";

let url = paths.GATEWAY_HTTP_URL + paths.URI_USER;
let url_login = paths.GATEWAY_HTTP_URL + paths.URI_LOGIN;

const Login = async(username, password)=>{
    try{
        const urlPath = `${url_login}`;
        const body = JSON.stringify({
            password:password,
            user:username,
        })
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        };
        
        const response = await fetch(`${urlPath}`, settings)
        console.log(response);
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}

const SaveUser = async(User, newObjFlag)=>{
    try{
        const body = JSON.stringify(User)
        const settings = {
            method: newObjFlag?'POST':'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        };

        const response = await fetch(url, settings)
        //console.log(response.body);
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}

const DeleteUser = async(id, worker)=>{
    try{
        const urlPath = `${url}?_id=${id}&worker=${worker}`;
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
const GetUsers = async(type, user_id)=>{
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(`${url}/?user_id=${user_id}&type=${type}`,settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}
const GetUser = async(user_id)=>{
    try{
        const settings = {
            method: 'GET',                    
        };
        const response = await fetch(`${url}/?user_id=${user_id}`,settings)
        const data = await response.json();
        return data;
    }
    catch(error){
        return 0;
    }
}


export {GetUsers,SaveUser,Login,DeleteUser, GetUser}

