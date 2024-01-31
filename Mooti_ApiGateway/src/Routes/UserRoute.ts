
import {server, URI_COW, URI_COW_PARAM, URI_USER, URI_USER_LOGIN, URL_PARAM_SERVICE, URL_USER_SERVICE} from "../index"
import axios from "axios";



export default function UserRoute(){

    server.route(URI_USER)
    .all((req, res, next) => next())
    .get(async (req, res, next)=> {
        const user_id = req.query.user_id ?? ""
        const type = req.query.type ?? ""

        try{
            //let r = await axios.get(`http://mooti-user.eastus.azurecontainer.io:8003/?user_id=${user_id}&type=${type}`);
            let r = await axios.get(`${URL_USER_SERVICE}/?user_id=${user_id}&type=${type}`);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
        //console.log("get user request")
    })
    .post(async (req, res, next)=> {
        const data = req.body;
        try{
            let r =  await axios.post(URL_USER_SERVICE,data);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .put(async (req, res, next)=> {
        const data = req.body;
        try{
            let r =  await axios.put(URL_USER_SERVICE,data);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .delete(async(req,res,next)=>{
        const _id = req.query._id  ??  "";
        const worker = req.query.worker ?? "0";
        let response = {res:false};
        try{
            let ping_u = await axios.get(`${URL_USER_SERVICE}/?ping=1`);
            let ping_p = await axios.get(`${URL_PARAM_SERVICE}/?ping=1`);

            if(ping_u.data?.res && ping_p.data?.res){

                let r =  await axios.delete(`${URL_USER_SERVICE}/?_id=${_id}`);
                if(!(+worker)){

                    if(r.data.res){
                        r = await axios.delete(`${URL_PARAM_SERVICE}${URI_COW}/?user_id=${_id}`);
                        if(r.data.res){
                            r= await axios.delete(`${URL_PARAM_SERVICE}/?user_id=${_id}`);
                            if(r.data.res){
                                r= await axios.delete(`${URL_PARAM_SERVICE}${URI_COW_PARAM}/?user_id=${_id}`);
                                if(r.data.res){
                                    response.res = true;
                                }
                            }
                        }
                    }
                }else{
                    response.res = true;
                }
            }
           
        }catch(e){
            console.log("Error "+e)
        }
        res.send(response);
    })
    
    server.post(URI_USER_LOGIN as string,async (req,res)=>{
        const data = req.body;
        try{
            let r =  await axios.post(URL_USER_SERVICE + URI_USER_LOGIN,data);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
}

