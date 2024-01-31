function Packet(cow_id:string, param_id:string, datetime:string,value:string) {
   
    return({
        param_id : param_id,
        cow_id : cow_id,
        datetime : datetime,
        value : value,
    })
}

class MootiData{
    user_id:string;
    data:any[];
    constructor(cow_id:string, param_id:string, datetime:string, value:string){
        this.user_id="";
        this.data = new Array<any>();
        this.data.push(Packet(cow_id,param_id,datetime,value));
    }
}

export {MootiData ,Packet}