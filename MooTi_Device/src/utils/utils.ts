function GetRandomValue(value:number):string{
    let val:number = value + (Math.random() < 0.5 ? 1 : -1) * Math.random();
    return ""+val
}
function GetRandomSeconds(value:number):string{
    let val:number = value + Math.random() + Math.random()*100;
    return ""+val;
}

function delay(ms:number):Promise<void>{
    return new Promise(resolve => setTimeout(resolve,ms));
}

function BuildDate(d:Date):string{
    return `${d.getFullYear()}/${d.getMonth().toString().padStart(2,'0')}/${d.getDate().toString().padStart(2,'0')}-${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
}
function UpdateDate(d:Date):string{
    d.setDate(d.getDate() + 1)
    return BuildDate(d);
}
function UpdateSeconds(d:Date):string{
    d.setSeconds(d.getSeconds() + (+GetRandomSeconds(60)));
    return BuildDate(d);
}

export {
GetRandomValue,
BuildDate,
UpdateDate,
GetRandomSeconds,
delay,
}