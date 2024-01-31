import CowController from "../Controllers/CowController";
import {server, URI_COW} from "../index"

export default function CowRoutes(){
    server.route(URI_COW)
    .all((req, res, next) => next())
    .get((req, res, next)=> {
        const user_id = req.query.user_id as string ?? "";
        if(user_id!=""){
            CowController.getInstance().GetCows(user_id)
            .then(e=>res.json(e))
            .catch(e=> res.send(null));
        }else{
            res.send(null)
        }
    })
    .post((req, res, next)=> {   
        CowController.getInstance().SaveCow(req.body,true)
        .then(e=>res.json(e))
        .catch(e=> res.send(null));
    })
    .put((req, res, next)=> {
        CowController.getInstance().SaveCow(req.body)
        .then(e=> res.json(e))
        .catch(e=> res.send(null));
    })
    .delete((req,res,next)=>{
        const CowID = req.query.CowID as string ?? "";
        const user_id = req.query.user_id as string ?? "";
        if(user_id !== "" && CowID !== ""){
            CowController.getInstance().DeleteCow(user_id,CowID)
            .then(e=> res.json({res:e}))
            .catch(e=>res.json({res:false}));
        }else if(user_id !== "" && CowID === ""){
            CowController.getInstance().DeleteCowsByUser(user_id)
            .then(e=> res.json({res:e}))
            .catch(e=>res.json({res:false}));
        }else{
            res.json({res:false});
        }    
    });

}