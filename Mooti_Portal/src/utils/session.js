
function onSession(){
    return getSessionItem("farm")
}

function setSession(data){
    setSessionItem("farm",data);
}

function closeSession(){
    setSessionItem("farm","");
}

function setSessionItem(name, value) {
    var mySession;
    try {
        mySession = JSON.parse(localStorage.getItem('mySession'));
    } catch (e) {
        console.log(e);
        mySession = {};
    }
    if(mySession == null) mySession ={};
    mySession[name] = value;
    mySession = JSON.stringify(mySession);
    localStorage.setItem('mySession', mySession);
}
function getSessionItem(name) {
var mySession = localStorage.getItem('mySession');
    if (mySession) {
        try {
            mySession = JSON.parse(mySession);
            let val = mySession[name]
            return mySession[name];
        } catch (e) {
            console.log(e);
        }
    }
}

export {
    closeSession,
    setSession,
    onSession
}