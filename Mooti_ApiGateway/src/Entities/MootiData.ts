class Packet{
    constructor(
        public param_id : string,
        public cow_id : string,
        public datetime : string,
        public value : string,
    ){}
}

class MootiData{
    constructor(
        public user_id:string,
        public data:Packet[]
    ){}
}

//export {MootiData,Packet}