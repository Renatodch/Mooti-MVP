const _User = (user?: User)=>{
    return{
        //UserID : user?.UserID || "",
        Name : user?.Name || "",
        Description :  user?.Description || "",
        Password : user?.Password || "",
        Type :  user?.Type ? +user?.Type :  0,
        Active : user?.Active || false,
        TelegramUserID : user?.TelegramUserID as string || "",
        ChatID : user?.ChatID as string || "",
        TelegramUserActive : user?.TelegramUserActive || false,
        parent_id : user?.parent_id || "",
    };
}
class User{
    //UserID:string = "";
    Name:string = "";
    Description:string = "";
    Password:string = "";
    Type:Number = 0;
    Active:boolean = false;
    TelegramUserID:string = "";
    ChatID:string = "";
    TelegramUserActive:boolean = false;
    parent_id:string = "";

    constructor(){}
}

class TelegramUser{
    TelegramUserID:string ="";
    chatID:string ="";
    constructor(chatID:string, TelegramUserID:string){
        this.TelegramUserID = TelegramUserID;
        this.chatID = chatID;
    }
}
export {User, _User, TelegramUser}