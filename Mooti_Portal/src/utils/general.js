import { messages } from "./responses"
import ErrorPage from "../View/Error"

function disableButton(id){
    $(`#${id}`).removeAttr("enabled")
    $(`#${id}`).attr("disabled","")
}
function enableButton(id){
    $(`#${id}`).removeAttr("disabled")
    $(`#${id}`).attr("enabled")
}

function operationDone(idModal, idModalButton){
    $(`#${idModal}`).modal("hide")
    enableButton(idModalButton)
}
function isNoValid(obj,idModalButton){
    if(obj == null){
        enableButton(idModalButton)
        return true;
    } else 
    return false;
}
function isResError(res, idModalButton){
    console.log(res)
    if(res === 0 || (res.res!=undefined && typeof res.res === "boolean" && !res.res)){
        alert(messages.BAD_GATEWAY);
        enableButton(idModalButton);
        return true;
    }
    else{
        return false;
    }
}

function isResMainError(res, content){
    if(res === 0){
        $(content).html(ErrorPage(messages.BAD_GATEWAY));
        return true;
    }else{
        return false;
    }
}

function setCurrentPage(id){
    let _id= $(`#${id}`);
    if(!_id.hasClass("active")){
        _id.addClass("active");
        _id.attr("aria-current","page")   
    }
}
function centerObject(obj){
    $(obj).css({
        "justify-content": "center",
        "display": "flex",
        "align-items": "center",
    });
}

function pathContent(path){
    $("#navPathDiv_id").html(
        `
        <div>
            <div class="p-2 bg-success text-white">
                ${path}
            </div>
        </div>
        `
    );
}
function containsWhitespace(str) {
    return /\s/.test(str);
  }
function customDT(obj){
    return {
        order: [[2, 'asc']],
        scrollX:true,
        scrollY:true,
        
        autoWidth:false,
        
        "language": {
            "lengthMenu": `Mostrar _MENU_ ${obj.plural}`,
            "zeroRecords": `No se encontraron ${obj.plural}`,
            "info": "",
            "infoEmpty": `Ninguna ${obj.singular} disponible`,
            "infoFiltered": `(Filtrado de _MAX_ ${obj.plural})`,
            "search": "Buscar",
            "paginate": {
            "first":      "Primero",
            "last":       "Último",
            "next":       "Siguiente",
            "previous":   "Anterior"
            },
        }
    }
}

const getHash =()=>{
    if(location.hash.toString().length == 0){
        return '/'; 
    }else{
        let arr = location.hash.toString().toLocaleLowerCase().split('/')
        if (arr[0]=="home") return "home";
        else return (arr[1] || '');
    }

}

const getIndex = (hash) =>{
    return location.hash.toString().toLocaleLowerCase().split('/')[2]
}


const resolveRoutes = (hash) =>{
    if(hash==="/") return hash
    return `/${hash}`;
}

export {
    setCurrentPage, 
    centerObject,
    pathContent,
    customDT,
    getHash,
    getIndex,
    resolveRoutes,
    disableButton,
    enableButton,
    operationDone,
    isResError,
    isNoValid,
    isResMainError
}