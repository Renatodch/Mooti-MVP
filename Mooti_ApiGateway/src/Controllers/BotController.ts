import axios from "axios"
import { responses, telegramMessages } from "../utils/responses";
import { URI_USER_TELEGRAM, URL_TELEGRAM, URL_USER_SERVICE, URL_WEBHOOK } from "..";

export default class BotController{
    TelegramUrl:any;
    WebhookUrl:any;

    private static instance:BotController;
    private constructor(){}
    public static getInstance(){
        if(!BotController.instance){
            BotController.instance = new BotController();
        }
        return BotController.instance;
    }
    
    SetWebhook = async()=>{
        try{
            //console.log(URL_WEBHOOK);
            return await axios.get(`${URL_TELEGRAM}/setWebhook?url=${URL_WEBHOOK}`)
        }catch(error){
            return {data:"No se pudo establecer el webhook para el bot"};   
        }
    }

    ActivateTelegramUser=async(packet:any):Promise<boolean>=>{
        let telegramuserid;
        let chatId;
        let user_id;
        try{
            telegramuserid = packet.message.chat.username || packet.message.chat.title || ""
            chatId = packet.message.chat.id;
            if(packet.message.text == undefined){
                return false;
            }
            user_id = packet.message.text;

            if(/\s/.test(telegramuserid) || /\s/.test(user_id)){
                await this.Send(telegramMessages.messageWrongUserSpaces,chatId);
                return false;
            }
    
            const data = {
                TelegramUserID: telegramuserid,
                ChatID: chatId,
                user_id: user_id,
            };

            let resultMessage = telegramMessages.messageServerError;
            let r =  await axios.post(URL_USER_SERVICE+URI_USER_TELEGRAM,data);
            switch(r.data.res){
                case responses.SUCCESS_SAVE:
                    resultMessage = `${telegramMessages.messageConfirmation} ${r.data.d._id}`
                    break;
                case responses.ALREADY_EXIST:
                    resultMessage = `${telegramMessages.messageAlreadyInUse} ${r.data.d._id}`
                    break;
                case responses.TELEGRAM_USER_DONT_EXIST:
                    resultMessage = `${telegramMessages.messageRejection}  ${r.data.d._id}`
                    break;
                case responses.USER_DONT_EXIST:
                    resultMessage = `${telegramMessages.messageUserDontExist(r.data.d._id)}`
                    break;
                case responses.SERVER_ERROR:
                    resultMessage = telegramMessages.messageServerError
                    break;
            }
    
            await this.Send(resultMessage,chatId);
             // r= if chatid doesnt exist
            return true;
        }catch(e){
            console.error(telegramMessages.messageServerError+ ": " + e);
        }
        return false;
    }

    Send = async(message:string,chatId:string):Promise<any>=>{
        let r = null;
        try{
            r = await axios.post(`${URL_TELEGRAM}/sendMessage`, {
                chat_id: parseInt(chatId),
                text: message,
                parse_mode:'Markdown'
            })
        }
        catch(e){
            console.log("Error: "+e)
        }
        return r;
    }


}