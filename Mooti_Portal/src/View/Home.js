import * as s from "../utils/session";
import { uris } from "../utils/responses";
import * as da from "../Controller/UserController"
import {types} from "./User"
import {responses, messages, lengths} from "../utils/responses"

let user_id;
let fullname;
let type;
let parent_id;

function validations(){
    let Type = $('select[name=selectorType]').val();
    let Password = $("#idPass").val();
    let Description = $("#idDescription").val();
    let Name = $("#idName").val();
    let Active = $("#idActive").prop("checked");
    let TelegramUserActive = $("#idTelegramUserActive").prop("checked");
    let TelegramUserID = $("#idTelegramUserID").val();
    let ChatID = $("#idChatID").val();

    let _id = $("#idUser").val();

    let fields = document.querySelectorAll('.needs-validation')
    fields.forEach(element => {
        element.classList.add('was-validated');
    });

    Name = Name.trim();
    Description = Description.trim();

    if(Name == "" || Password == ""){
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


let buttonSave=async()=>{
    let obj = validations();
    if(obj==null) return;

    let res =   await da.SaveUser(obj, false);
    if(res === 0){
        alert(messages.BAD_GATEWAY); return;
    }
    switch(res.res){
        case responses.SUCCESS_SAVE:
            UpdateProfile(res.d);
            break;
        case responses.SERVER_ERROR:
            alert(messages.SERVER_ERROR);
            return;
    }
    $("#templateModal_id").modal("hide");

}
function UpdateProfile(d){
    s.setSession(d)
    $("#profileModal_id div:first-child").text(`${types[d.Data.Type]}: ${d.Data.Name}`)
}

let modalSave =async (e, button)=> {
    let user = await da.GetUser(user_id);
    if(user === 0){
        alert(messages.BAD_GATEWAY); return;
    }
    let obj = {
        Name : user.Data.Name,  
        _id : user._id,
        Password : user.Data.Password,  
        Type : user.Data.Type,
        Description : user.Data.Description,  
        Active : user.Data.Active,  
        TelegramUserID : user.Data.TelegramUserID,  
        TelegramUserActive : user.Data.TelegramUserActive,  
        ChatID : user.Data.ChatID,  
    }

    return {
    "buttonHandler": buttonSave,
    "buttonTitle":`${button}`,
    "title": `Perfil de ${obj.Name}`,
    "body": 
    `
    <div class="row" id="modalContent_id">
        <div class="col">
            <div class="row ">
                <div class="col mb-3 needs-validation">
                    <label for="idName" class="form-label">Nombre Completo *</label>
                    <input type="text" maxlength="${lengths.MAX_32}" class="form-control" id="idName" required value="${obj.Name}">
                </div>
                <div class="col mb-3">
                    <label for="idDescription" class="form-label">Descripcion</label>
                    <input type="text" maxlength="${lengths.MAX_64}" class="form-control" id="idDescription" value="${obj.Description}">
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col mb-3">
                    <label for="idUser" class="form-label">ID de Usuario</label>
                    <input ${obj._id?"disabled":"enabled"} type="text" class="form-control" id="idUser" required value="${obj._id}">
                </div>
                <div class="col mb-3 needs-validation">
                    <label for="idPass" class="form-label">Clave de Usuario *</label>
                    <input type="text" maxlength="${lengths.MAX_8}" class="form-control" id="idPass" required value="${obj.Password}">
                </div>
                <div hidden class="col-3">
                    <input ${(obj.Active)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idActive">
                    <label class="form-check-label" for="idActive">Activo</label>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="col mb-3">
                    <label class="form-check-label" for="idType">Tipo</label>
                    <select disabled class="form-select mt-2" aria-label="" id="idType" name="selectorType">
                        ${
                            Object.values(types).map((v,i)=>{
                                
                                return (`
                                <option ${obj.Type==i?"selected":""} value="${i}">${v}</option>
                                `);
                            })
                        }
                    </select>
                </div>
                <div class="col mb-3">
                    <label for="idTelegramUserID" class="form-label">Usuario de Telegram</label>
                    <input type="text" maxlength="${lengths.MAX_32}" class="form-control" id="idTelegramUserID" required value="${obj.TelegramUserID}">
                </div>
                <div class="col-3 ">
                    <input disabled ${(obj.TelegramUserActive)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idTelegramUserActive">
                    <label class="form-check-label" for="idTelegramUserActive">Activado</label>
                </div>
                <div class="col mb-3" hidden>
                    <label for="idChatID" class="form-label">Clave de Usuario</label>
                    <input type="text" class="form-control" id="idChatID" required value="${obj.ChatID}">
                </div>
            </div>
            <div class="row mt-3 mb-1">
                <strong>(*) Campos obligatorios</strong> 
            </div>
        </div>
    </div>
    `
}};
    


const Home = async(c)=>{
    let user = s.onSession()
    user_id = user._id||"";
    fullname = user.Data.Name||"";
    type = +user.Data.Type;
    parent_id = user.Data.parent_id;

    $(c).html(`
        <div id="homeDiv_id"  class="container-fluid px-0">
            <div class="row gx-0" >
                <div class="col-12" id="headerDiv_id">
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
                        <div class="container-fluid">
                            <a href="#" id="header_title">
                                <img alt="mooti" src="./assets/MOOTI.png" width="130" height="60">
                            </a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li class="nav-item">
                                        <a class="nav-link " id="chartNavLink_id"  aria-current="page" href="#">Inicio</a>
                                    </li>

                                    
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" id="adminNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            ${(type === 1 || type === 0)?"Administración":"Consultas"}
                                        </a>
                                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="adminNavbarDropdown">
                                            <li>
                                                <a id="cowNavLink_id" class="dropdown-item" href="#${uris.PAGE_COW}"> 
                                                    Vacas
                                                </a>
                                            </li>
                                            
                                            ${(type === 1 || type === 0)?
                                            `<li>
                                                <a class="dropdown-item" id="userNavLink_id" href="#${uris.PAGE_USER}"> 
                                                Usuarios
                                                </a>
                                            </li>`:""}
                                          
                                            <li>
                                                <a class="dropdown-item" id="paramNavLink_id" href="#${uris.PAGE_PARAM}"> 
                                                    Parámetros
                                                </a>
                                            </li>
                                            <!-- <li><hr class="dropdown-divider"></li> -->
                                            <li hidden>
                                                <span class="dropdown-item" href="#">
                                                    Dashboard&raquo;
                                                </span>
                                                <ul class="dropdown-menu dropdown-submenu dropdown-menu-dark">
                                                    <li><a class="dropdown-item" href="#${uris.PAGE_PARAM}">Variables</a></li>
                                                    <li><a class="dropdown-item" href="#${uris.PAGE_NOTIFICATION}">Notificaciones</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link " id="infoNavLink_id"  aria-current="page" href="#${uris.PAGE_INFO}">Fuentes IoT Info</a>
                                    </li>
                                    
                                </ul>
                                <div class="d-flex">
                                    <span class="me-4 " htmlFor="" id="profileModal_id">
                                        <div class="me-4 mt-0">${types[type]}: ${fullname}</div>
                                        <div class="me-4 mt-0">@${user_id}</div>
                                    </span>
                                    <button class="btn btn-outline-success" id="btnKill_id">Cerrar sesión</button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <div class="row gx-0">
                <div class="col-12" id="navPathDiv_id">
                </div>
            </div >
            <div class="row gx-0 mt-4" id="navContentDiv_id" >
               
            </div>

            <!-- Modal Template -->
            <div class="modal fade" id="templateModal_id" tabindex="-1" aria-labelledby="templateModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="templateModalLabel">Formulario de Granja</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="modalBody_id">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="btnSaveModal_id" class="btn btn-primary">Registrar</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

    

        </div>
    `);
    $("#btnKill_id").on("click",()=>{
        s.closeSession();
        location.reload() //="./"
       
    });
    $("#profileModal_id").on("click",async (e)=>{
        let modal = await modalSave($(e.target),"Actualizar");
        BuildModal(modal);
    })
}

function BuildModal(modal){
    $("#templateModalLabel").html(modal.title)
    $("#modalBody_id").html(modal.body);
    $("#btnSaveModal_id").html(modal.buttonTitle)
    $("#btnSaveModal_id").off("click");
    $("#btnSaveModal_id").on("click",modal.buttonHandler);
    
    $("#templateModal_id").modal("show");
}


export { Home};