const _Parameter = (parameter?: Parameter)=>{
    return{
        Name : parameter?.Name || "",
        ParamID : parameter?.ParamID || "",
        //KpiValue :  parameter?.KpiValue ? +parameter.KpiValue :  0,
        Unit: parameter?.Unit || "",
        Active : parameter?.Active || false,
        
        MaxValue :  parameter?.MaxValue ? +parameter.MaxValue :  0,
        MinValue :  parameter?.MinValue ? +parameter.MinValue :  0,
        HighIndicator :  parameter?.HighIndicator ? +parameter.HighIndicator :  0,
        LowIndicator :  parameter?.LowIndicator ? +parameter.LowIndicator :  0,
        EnableN1 : parameter?.EnableN1 || false,
        Message1 : parameter?.Message1 || "",
        EnableN2 : parameter?.EnableN2 || false,
        Message2 : parameter?.Message2 || "",
        EnableN3 : parameter?.EnableN3 || false,
        Message3 : parameter?.Message3 || "",

        Triggered: parameter?.Triggered ? +parameter.Triggered : 0,
        user_id : parameter?.user_id || "",
    };
}
class Parameter{
    Name:string = "";
    ParamID:string = "";
    //KpiValue:Number = 0;
    Unit:string = "";
    Active:boolean = false;

    EnableN1:boolean = false;
    Message1:string = "";
    EnableN2:boolean = false;
    Message2:string = "";
    EnableN3:boolean = false;
    Message3:string = "";
    MaxValue:Number = 0;
    MinValue:Number = 0;
    LowIndicator:Number = 0;
    HighIndicator:Number = 0;
    Triggered: Number = 0;
    user_id:string = "";
    
    constructor(){}
}

export {Parameter, _Parameter}