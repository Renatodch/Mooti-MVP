import * as dotenv from "dotenv"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

dotenv.config();

import UserController from "../Controllers/UserController";

const server = express();
server.use(bodyParser.json());


const URI_USER_LOGIN : string = process.env.URI_USER_LOGIN ?? "";
const URI_USER_TELEGRAM : string = process.env.URI_USER_TELEGRAM ?? "";
const HTTP_PORT : string = process.env.HTTP_PORT ?? "";


const corsOptions = {
    origin:"*",
    optionsSuccessStatus:200,
};

server.use(cors(corsOptions));
server.listen(HTTP_PORT, ()=> console.log("user service running at "+ HTTP_PORT));

server.route("/")
.all((req, res, next) => next() )
.get(async (req, res, next)=> {
    const ping = req.query.ping as string ?? "";
    const user_id = req.query.user_id as string ?? "";
    const type = req.query.type as string ?? "";

    if(ping !== ""){
        res.json({res:true});
    }
    else if(user_id !== "" && type===""){
        UserController.getInstance().GetUser(user_id)
        .then(e=>res.json(e))
        .catch(e=> res.send(null));
    }
    else if(user_id !== "" && type!==""){
        UserController.getInstance().GetUsers(user_id, type)
        .then(e=>res.json(e))
        .catch(e=> res.send(null));
    }
    else{
        UserController.getInstance().GetUsers()
        .then(e=>res.json(e))
        .catch(e=> res.send(null));
    }
})
.post(async (req, res, next)=> {
    UserController.getInstance().SaveUser(req.body)
    .then(e=>res.json(e))
    .catch(e=> res.send(null));
})
.put(async (req, res, next)=> {
    UserController.getInstance().SaveUser(req.body,false)
    .then(e=>res.json(e))
    .catch(e=> res.send(null));
})
.delete(async(req,res,next)=>{
    const _id = req.query._id as string ?? "";
    UserController.getInstance().DeleteUser(_id)
    .then(e=>res.json({res:e}))
    .catch(e=>res.json({res:false}));
})

server.post(URI_USER_LOGIN, async (req, res, next)=> {
    const user = req.body.user ?? ""; 
    const pass = req.body.password ?? "";
    UserController.getInstance().ValidateUser(user,pass)
    .then(e=> res.json(e))
    .catch(e=> res.send(null));
});


server.route(URI_USER_TELEGRAM)
.all((req, res, next) => next() )
.post(async (req, res, next)=> {
    const TelegramUserID = req.body.TelegramUserID ?? ""; 
    const ChatID = req.body.ChatID ?? "";
    const user_id = req.body.user_id ?? "";
    UserController.getInstance().ActivateTelegramUser(user_id,TelegramUserID,ChatID)
    .then(e=> res.json(e))
    .catch(e=> res.send(null));
})
.get(async (req, res, next)=> {
    const user_id = req.query.user_id as string ?? "";

    UserController.getInstance().GetTelegramUsers(user_id)
    .then(e=>res.json(e))
    .catch(e=> res.send(null));
});

export {server}