const _Cow = (cow?: Cow)=>{
    return{
        CowID : cow?.CowID || "",
        Name : cow?.Name || "",
        Age :  cow?.Age ? +cow.Age :  0,
        Breed : cow?.Breed? +cow.Breed : 0,
        Weight :  cow?.Weight ? +cow?.Weight :  0,
        Active : cow?.Active || false,
        user_id : cow?.user_id || "",
    };
}
class Cow{
    constructor(
        public CowID:string = "",
        public Name:string = "",
        public Age:Number = 0,
        public Breed:number = 0,
        public Weight:Number = 0.0,
        public Active:boolean = false,
        public user_id:string = "",
    ){}
}

export {Cow, _Cow}