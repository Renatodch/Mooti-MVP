import {server, URI_COW_PARAM, URI_PARAM, URL_PARAM_SERVICE} from "../index"
import axios from "axios";


export default function ParameterRoute(){
    server.route(URI_PARAM)
    .all(function (req, res, next) {
        next();
    })
    .get(async (req, res, next)=> {
        let r = null;
        let user_id:string = req.query.user_id as string ?? "";
        let _id:string = req.query._id as string ?? "";
        try{
            if(user_id != ""){
                r = await axios.get(`${URL_PARAM_SERVICE}/?user_id=${user_id}`);
            
            }else if(_id != ""){
                r = await axios.get(`${URL_PARAM_SERVICE}/?_id=${_id}`);
            }
            res.send(r?.data);
        }
        catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .post(async (req, res, next)=> {
        const param = req.body;
        try{
            let r =  await axios.post(URL_PARAM_SERVICE,param);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .put(async (req, res, next)=> {
        const param = req.body;
        try{
            let r =  await axios.put(URL_PARAM_SERVICE,param);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .delete(async(req,res,next)=>{
        const user_id = req.query.user_id ?? "";
        const ParamID = req.query.ParamID ?? "";
        let response = {res:false};
        try{
            let ping_p = await axios.get(`${URL_PARAM_SERVICE}/?ping=1`);
            if(ping_p.data?.res){
                let r =  await axios.delete(`${URL_PARAM_SERVICE}/?user_id=${user_id}&ParamID=${ParamID}`);
                if(r.data.res){
                    r= await axios.delete(`${URL_PARAM_SERVICE}${URI_COW_PARAM}/?user_id=${user_id}&ParamID=${ParamID}`);
                    if(r.data.res){
                        response.res = true;
                    }
                }
            }

        }catch(e){
            console.log("Error "+e)
        }
        res.send(response);
    })
}
