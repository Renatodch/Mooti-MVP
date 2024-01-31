const _Cow = (cow?: Cow)=>{
    return{
        CowID : cow?.CowID || "",
        Name : cow?.Name || "",
        Age :  cow?.Age ? +cow.Age :  0,
        Breed : cow?.Breed ? +cow.Breed : 0,
        Weight :  cow?.Weight ? +cow?.Weight :  0,
        Active : cow?.Active || false,
        user_id : cow?.user_id || "",
    };
}
class Cow{
    CowID:string = "";
    Name:string = "";
    Age:Number = 0;
    Breed:number = 0;
    Weight:Number = 0.0;
    Active:boolean = false;
    user_id:string = "";
    
    constructor(){}
}

export {Cow, _Cow}