export default interface ISource{
    user_id:string;
    cow_id:string;
    param_id:string;
    data:Array<any>;
    Send(date:string, value:string):void;
    Connect():void
}