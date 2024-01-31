import {server, URI_WEBHOOK} from "../index"
import BotController from "../Controllers/BotController";

export default async function BotRoute(){
    const res = await BotController.getInstance().SetWebhook();
    //console.log(res)
    if(res.data.ok == undefined || !res.data.ok){
        console.log("No se pudo establecer el WebHook de Telegram");
        return;
    }

    server.post(URI_WEBHOOK, async (req,res)=>{
        await BotController.getInstance().ActivateTelegramUser(req.body);
        return res.send();
    
    });
}