
import ParameterController from "../Controllers/ParameterController";
import {server} from "../index"

export default function ParameterRoutes(){
    server.route("/")
    .all((req, res, next) =>next())
    .get((req, res, next)=> {
        const user_id = req.query.user_id as string ?? "";
        const _id = req.query._id as string ?? "";
        const ping = req.query.ping as string ?? "";
    
        if(ping !== ""){
            res.json({res:true});
        }
        else if(user_id !== ""){
            ParameterController.getInstance().GetParameters(user_id)
            .then(e=> res.json(e))
            .catch(e=> res.send(null));
        }else if(_id !== ""){
            ParameterController.getInstance().GetParameter(_id)
            .then(e=>res.json(e))
            .catch(e=> res.send(null));
        }else{
            res.send(null)
        }
    })
    .post((req, res, next)=> {  
        ParameterController.getInstance().SaveParameter(req.body,true)
        .then(e=> res.json(e))
        .catch(e=> res.send(null));
    })
    .put((req, res, next)=> {
        ParameterController.getInstance().SaveParameter(req.body)
        .then(e=> res.json(e))
        .catch(e=> res.send(null));
    })
    .delete((req,res,next)=>{
        const ParamID = req.query.ParamID as string ?? "";
        const user_id = req.query.user_id as string ?? "";
        if(user_id !== "" && ParamID !== ""){
            ParameterController.getInstance().DeleteParameter(user_id,ParamID)
            .then(e=>res.json({res:e}))
            .catch(e=> res.json({res:false}));
        }else if(user_id !== "" && ParamID === ""){
            ParameterController.getInstance().DeleteParametersByUser(user_id)
            .then(e=>res.json({res:e}))
            .catch(e=> res.json({res:false}));
        }else{
            res.json({res:false})
        }
    })
}
