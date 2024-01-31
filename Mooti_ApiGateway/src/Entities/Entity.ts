class Entity<T>{
    Data:T;
    _id:string;
    constructor(data:T, _id:string){
        this.Data = data ;
        this._id =_id ;
    }
}


export {Entity}