import CowParamController from "../Controllers/CowParamController";
import {server, URI_COW_PARAM} from "../index"


export default function CowParamRoutes(){
    server.post((`${URI_COW_PARAM}/report`),(req,res)=>{

        CowParamController.getInstance().GetCowParamsForReport(req.body)
        .then(array=>res.json(array))
        .catch(e=> res.send(null))
    })

    server.route(URI_COW_PARAM)
    .all((req, res, next)=>next())
    .get( (req, res, next)=> {
        const user_id = req.query.user_id as string ?? "";
        const CowID = req.query.CowID as string ?? "";

        if(CowID !== "" && user_id !== ""){
            CowParamController.getInstance().GetCowParamsForDetail(user_id,CowID)
            .then(array=>res.json(array))
            .catch(e=> res.send(null));
        }else{
            res.send(null);
        }
    })
    .post((req,res,next)=>      
        CowParamController.getInstance().SaveCowParam(req.body)
        .then(result=>res.json(result))
        .catch(e=> res.send(null))  
    )
    .delete((req,res,next)=>{
        const user_id = req.query.user_id as string ?? "";
        const ParamID = req.query.ParamID as string ?? "";
        const CowID = req.query.CowID as string ?? "";
    
        if(CowID === "" && user_id !== "" && ParamID === ""){
            CowParamController.getInstance().DeleteCowParamsByUser(user_id)
            .then(e=>res.json({res:e}))
            .catch(e=> res.json({res:false}));
        }
        else if(CowID === "" && user_id !== "" && ParamID !== ""){
            CowParamController.getInstance().DeleteCowParamsByParameter(user_id, ParamID)
            .then(e=>res.json({res:e}))
            .catch(e=> res.json({res:false}));
        }
        else if(ParamID === "" && user_id !== "" && CowID !== ""){
            CowParamController.getInstance().DeleteCowParamsByCow(user_id,CowID)
            .then(e=> res.json({res:e}))
            .catch(e=> res.json({res:false}));
        }else{
            res.json({res:false});
        } 
    });
}