import {server, URI_COW, URI_COW_PARAM, URL_PARAM_SERVICE} from "../index"
import axios from "axios";


export default function CowRoute(){
    server.route(URI_COW)
    .all(function (req, res, next) {
        next();
    })
    .get(async (req, res, next)=> {
        const id = req.query.user_id ?? "";
        try{
            let r = await axios.get(`${URL_PARAM_SERVICE}${URI_COW}/?user_id=${id}`);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .post(async (req, res, next)=> {
        const cow = req.body;
        try{
            let r =  await axios.post(URL_PARAM_SERVICE + URI_COW,cow);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
        
    })
    .put(async (req, res, next)=> {
        const cow = req.body;
        try{
            let r =  await axios.put(URL_PARAM_SERVICE + URI_COW,cow);
            res.send(r?.data);
        }catch(e){
            console.log("Error "+e)
            res.send(null);
        }
    })
    .delete(async(req,res,next)=>{     
        const user_id = req.query.user_id ?? "";
        const CowID = req.query.CowID ?? "";
        let response = {res:false};
        try{
            let ping_p = await axios.get(`${URL_PARAM_SERVICE}/?ping=1`);
            if(ping_p.data?.res){
                let r =  await axios.delete(`${URL_PARAM_SERVICE}${URI_COW}/?user_id=${user_id}&CowID=${CowID}`);
                if(r.data.res){
                    r= await axios.delete(`${URL_PARAM_SERVICE}${URI_COW_PARAM}/?user_id=${user_id}&CowID=${CowID}`);
                    if( r.data.res){
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
