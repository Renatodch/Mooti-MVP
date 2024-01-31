
import * as da from "../Controller/UserController";
import * as s from "../utils/session";
import { setCurrentPage,pathContent,customDT, operationDone, disableButton, isResError, isNoValid, isResMainError, enableButton } from "../utils/general";
import { messages,responses,lengths } from "../utils/responses";
import ErrorPage from "./Error"


let openModalId = "btnOpenModalUser_id";
let user_id;
let user_type;
let UserDataTable

let types = {
    0:"Super Usuario",
    1:"Administrador",
    2:"Veterinario",
    3:"Granjero",
}

function validations(){
    let ParentID = SetParentID();

    let Type = $('select[name=selectorType]').val();
    let Password = $("#idPass").val();
    let Description = $("#idDescription").val();
    let Name = $("#idName").val();
    let Active = $("#idActive").prop("checked");
    let TelegramUserActive = $("#idTelegramUserActive").prop("checked");
    let TelegramUserID = $("#idTelegramUserID").val();
    let ChatID = $("#idChatID").val();
    let parent_id = ParentID;

    let _id = $("#idUser").val();

    let fields = document.querySelectorAll('.needs-validation')
    fields.forEach(element => {
        element.classList.add('was-validated');
    });

    Name = Name.trim();
    Description = Description.trim();

    if(Name == "" || Password == "" || _id ==""){
        return null;
    }
    
    let user= {
        Type,Password,Description,Name,Active,TelegramUserActive,TelegramUserID,ChatID,parent_id
    };
    let obj={
        Data:user,
        _id,
    }
    return obj;
}

let SetParentID = ()=>{
    let ParentID ="";
    switch(user_type){
        case 0:
            ParentID = "";
            break;
        case 1:
            if($('select[name=selectorType]').val() == 2 || $('select[name=selectorType]').val() == 3)
                ParentID = user_id;
            break;
        case 2:
        case 3:
            ParentID = $("#idParentID").val();
        break;
    }
    return ParentID;
}
let buttonSave=async()=>{
    disableButton("btnSaveModal_id");

    let newObjflag = !!parseInt($("#modalContent_id").attr("new"));
    let obj = validations();

    if(isNoValid(obj, "btnSaveModal_id")) return;
    let res =   await da.SaveUser(obj, newObjflag);
    if(isResError(res,"btnSaveModal_id")) return;

    switch(res.res){
        case responses.ALREADY_EXIST:
            alert(messages.USER_ALREADY_EXIST);
            enableButton("btnSaveModal_id");
            return;
        case responses.SUCCESS_SAVE:
            res.d._id != obj._id? AddRowDataTable(res.d):UpdateRowDataTable(res.d);
            break;
        case responses.SERVER_ERROR:
            alert(messages.SERVER_ERROR);
            enableButton("btnSaveModal_id");
            return;
    }
    
    operationDone("templateModal_id","btnSaveModal_id")
}
let buttonDelete=async()=>{
    disableButton("btnSaveModal_id");

    let _id = $("#deleteId span").text();  
    if(_id == user_id){
        alert(messages.CANT_DELETE_YOUR_OWN_USER);
        enableButton("btnSaveModal_id")
        return;
    }  

    let res = await da.DeleteUser(_id, +(user_type === 1))
    if(isResError(res,"btnSaveModal_id")) return;

    if(res.res){
        DeleteRowDataTable(_id);
    }
    operationDone("templateModal_id","btnSaveModal_id")
}

let rowTemplate = (e)=>{
    return(
    `
    <tr id="${e._id}">
        <td class="colUserID_class"> <span>${e._id}</span></td>
        <td class="colName_class"> <span>${e.Data.Name}</span></td>
        <td hidden class="colPassword_class"> <span>${e.Data.Password}</span></td>
        <td class="colType_class"> <span>${types[e.Data.Type]}</span></td>
        <td class="colDescription_class"> <span>${e.Data.Description}</span></td>
        <td class="colActive_class"> 
            <input disabled type="checkbox" ${e.Data.Active?"checked":""} class="input-group-text" />
        </td>
        <td hidden class="colTelegramUserID_class"> <span>${e.Data.TelegramUserID}</span></td>
        <td hidden class="colTelegramUserActive_class"> 
            <input disabled type="checkbox" ${e.Data.TelegramUserActive?"checked":""} class="input-group-text" />
        </td>
        <td hidden class="colChatID_class"> <span>${e.Data.ChatID}</span></td>
        <td hidden class="colParentID_class"> <span>${e.Data.parent_id}</span></td>
        <td > 
            <button class="input-group-text trashUser_class" ${(e.Data.Type===1 && user_type ===1)?
                "disabled":""}>
                <i class="fa fa-trash"></i>
            </button>
        </td>
        <td > 
            <button class="input-group-text modifyUser_class" ${(e.Data.Type===1 && user_type ===1)?
                "disabled":""}>
                <i class="fa fa-pencil"></i>
            </button>
        </td>
    </tr>
    `);
}

let modalDelete = (obj, buttonHandler) => {
    let newObj;
    newObj = {
        _id :  obj.closest("td").siblings(".colUserID_class").find("span").text()||"",
        Name :  obj.closest("td").siblings(".colName_class").find("span").text()||"",
    }

    return{
    "buttonHandler":buttonHandler,
    "buttonTitle":"Eliminar",
    "title":"Advertencia",
    "body": 
    `
    <div class="row">
        <div class="col" id="deleteId">
            <span hidden>${newObj._id}</span>
            ¿Seguro que deseas eliminar a ${newObj.Name} (${newObj._id})?
        </div>
    </div>
`}};

let modalSave =(obj, button)=> {
let newObjflag = false;   
if(obj[0].id == openModalId){
    newObjflag = true;
}
let newObj = {
    Name : !newObjflag? obj.closest("td").siblings(".colName_class").find("span").text():"",
    _id : !newObjflag? obj.closest("td").siblings(".colUserID_class").find("span").text():"",
    Password : !newObjflag? obj.closest("td").siblings(".colPassword_class").find("span").text():"",
    Type : !newObjflag? obj.closest("td").siblings(".colType_class").find("span").text():"",
    Description : !newObjflag? obj.closest("td").siblings(".colDescription_class").find("span").text():"",
    Active : !newObjflag? obj.closest("td").siblings(".colActive_class").find("input").prop("checked"):"",
    TelegramUserID : !newObjflag? obj.closest("td").siblings(".colTelegramUserID_class").find("span").text():"",
    TelegramUserActive : !newObjflag? obj.closest("td").siblings(".colTelegramUserActive_class").find("input").prop("checked"):"",
    ChatID : !newObjflag? obj.closest("td").siblings(".colChatID_class").find("span").text():"",
    ParentID : !newObjflag? obj.closest("td").siblings(".colParentID_class").find("span").text():"",
}


return {
"buttonHandler": buttonSave,
"buttonTitle":`${button}`,
"title":"Formulario de Usuario",
"body": 
`
<div class="row" id="modalContent_id" new="${+newObjflag}">
    <div class="col">
        <div class="row ">
            <div class="col mb-3 needs-validation">
                <label for="idName" class="form-label">Nombre Completo *</label>
                <input type="text" maxlength="${lengths.MAX_32}" class="form-control" id="idName" required value="${newObj.Name}">
            </div>
            <div class="col mb-3">
                <label for="idDescription" class="form-label">Descripción</label>
                <input type="text" maxlength="${lengths.MAX_64}" class="form-control" id="idDescription" value="${newObj.Description}">
            </div>
        </div>
        <div class="row align-items-center ">
            <div class="col mb-3 needs-validation">
                <label for="idUser" class="form-label">ID de Usuario *</label>
                <input ${newObj._id?"disabled":"enabled"} maxlength="${lengths.MAX_8}" type="text" class="form-control" id="idUser" required value="${newObj._id}">
            </div>
            <div class="col mb-3 needs-validation">
                <label for="idPass" class="form-label">Clave de Usuario *</label>
                <input type="text" class="form-control" maxlength="${lengths.MAX_8}" id="idPass" required value="${newObj.Password}">
            </div>
            <div class="col-3">
                <input ${(newObj.Active || newObjflag)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idActive">
                <label class="form-check-label" for="idActive">Activo</label>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col mb-3">
                <label class="form-check-label" for="idType">Tipo</label>
                <select ${!newObjflag && user_type!==1?"disabled":"enabled"} class="form-select mt-2" aria-label="" id="idType" name="selectorType">
                    ${
                        Object.values(types).map((v,i)=>{
                            let str = ""
                            switch(user_type){
                                case 0:
                                    if(i ===0 || i===1)
                                        str = `<option ${newObj.Type==v?"selected":""} value="${i}">${v}</option>`;
                                break;
                                case 1:
                                    if(i===2 || i===3)
                                        str = `<option ${newObj.Type==v?"selected":""} value="${i}">${v}</option>`;
                                
                                break;
                                default:
                                    str ="";
                            }
                            return str;
                        })
                    }
                </select>
            </div>
            <div class="col mb-3">
                <label for="idTelegramUserID" class="form-label">Usuario de Telegram</label>
                <input disabled type="text" class="form-control" id="idTelegramUserID" value="${newObj.TelegramUserID}">
            </div>
            <div class="col-3 ">
                <input disabled ${(newObj.TelegramUserActive)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idTelegramUserActive">
                <label class="form-check-label" for="idTelegramUserActive">Activado</label>
            </div>
            <div class="col mb-3" hidden>
                <label for="idChatID" class="form-label">Chat ID</label>
                <input type="text" class="form-control" id="idChatID" required value="${newObj.ChatID}">
            </div>
            <div class="col mb-3" hidden>
                <label for="idParentID" class="form-label">Parent ID</label>
                <input type="text" class="form-control" id="idParentID" required value="${newObj.ParentID}">
            </div>
        </div>
        <div class="row mt-3 mb-1">
            <strong>(*) Campos obligatorios</strong> 
        </div>
    </div>
</div>
`
}};



const User = async(content)=>{
    
    pathContent("Administración > Usuarios");
    setCurrentPage("adminNavbarDropdown");
    user_id = s.onSession()._id;
    user_type = +s.onSession().Data.Type;

    let users = await da.GetUsers(user_type,user_id);
    if(isResMainError(users,content)) return;

    $(content).html(
        `
        <div id="userTableDiv_id" class="col">
            <div class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <button type="button" id="${openModalId}" class="btn btn-success text-white">
                        Nuevo Usuario
                    </button>
                </div>
            </div>
            <div class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <table id="userTable_id" class="table-primary table-sm  table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>ID de Usuario</th>
                                <th>Nombre Completo</th>
                                <th hidden>Clave</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Activo</th>
                                <th hidden>Usuario Telegram</th>
                                <th hidden>Usuario Telegram Activo</th>
                                <th hidden>chat id</th>
                                <th hidden>parent id</th>
                                <th>Eliminar</th>
                                <th>Modificar</th>
                            </tr>
                        </thead>
                        <tbody> 
                        ${users.map(e=>{
                            return ( rowTemplate(e))
                        }).join("")}
                            
                        </tbody>
                    </table> 
                </div>
            </div>
        <div>
        `
    );

    UpdateDatatableHandlers();
    CreateDataTable();

    $(`#${openModalId}`).on("click",(e)=>{
        BuildModal(modalSave($(e.target),"Registrar"));
    })
}
function UpdateDatatableHandlers(){
    $(".trashUser_class").off()
    $(".modifyUser_class").off();

    $(".trashUser_class").on("click",(e)=>{
        BuildModal(modalDelete($(e.target), buttonDelete));
    })
    $(".modifyUser_class").on("click",(e)=>{        
        BuildModal(modalSave($(e.target),"Modificar"));
    })
}
function CreateDataTable(){
    UserDataTable=$("#userTable_id").DataTable(customDT(
        {
            "singular":"usuario",
            "plural":"usuarios"
        }
    ));
}
function AddRowDataTable(d){
    UserDataTable.destroy();
    $("#userTable_id tbody").append(rowTemplate(d))    
    UpdateDatatableHandlers();
    CreateDataTable();
}
function UpdateRowDataTable(d){
    UserDataTable.destroy();
    $(`#userTable_id tbody tr[id=${d._id}]`).remove();
    $("#userTable_id tbody").append(rowTemplate(d))
    UpdateDatatableHandlers();    
    CreateDataTable();
}
function DeleteRowDataTable(_id){
    UserDataTable.destroy();
    $(`#userTable_id tbody tr[id=${_id}]`).remove();
    CreateDataTable();
}

function BuildModal(modal){
    $("#templateModalLabel").html(modal.title)
    $("#modalBody_id").html(modal.body);
    $("#btnSaveModal_id").html(modal.buttonTitle)
    $("#btnSaveModal_id").off("click");
    $("#btnSaveModal_id").on("click",modal.buttonHandler);
    
    if($("#idUser").length){
        $("#idUser").on('keypress', function(e) {
            if (e.which == 32){
                return false;
            }
        });
    }

    $("#templateModal_id").modal("show");
}



export {User, types}