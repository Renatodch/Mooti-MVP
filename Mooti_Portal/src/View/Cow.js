import * as da from "../Controller/ParameterController";
import * as s from "../utils/session"
import { setCurrentPage,pathContent,customDT, operationDone, disableButton, isResError, isNoValid, isResMainError, enableButton } from "../utils/general";
import {messages, responses,lengths} from "../utils/responses"
import { Timestamp } from "firebase/firestore";

let openModalId = "btnOpenModalCow_id";
let CowDataTable

let user_id;
let user_type;
let parent_id;

let types = {
    0:"Holstein",
    1:"Brownsuis",
    2:"Jersey",
    3:"Fleive",
}

function validations(){
    let CowID = $("#idCow").val();
    let Breed =  $('select[name=selectorBreed]').val();
    let Age = $("#idAge").val();
    let Weight = $("#idWeight").val();
    let Name = $("#idName").val();
    let Active = $("#idActive").prop("checked");

    let _id = $("#idCowReal").val();

    let fields = document.querySelectorAll('.needs-validation')
    fields.forEach(element => {
        element.classList.add('was-validated');
    });

    Name = Name.trim();

    if(Name == "" || Age == "" || CowID =="" || Weight ==""){
        return null;
    }

    if(Weight.includes("-")){
        return null;
    }
    
    let obj={
        Data:{CowID,Breed,Age,Weight,Name,Active,user_id},
        _id,
    }
    return obj;
}


let buttonSave=async()=>{
    disableButton("btnSaveModal_id");
    let newObjflag = !!parseInt($("#modalContent_id").attr("new"));
    let obj = validations();
    
    if(isNoValid(obj, "btnSaveModal_id")) return;
    let res =   await da.SaveCow(obj, newObjflag);
    if(isResError(res,"btnSaveModal_id")) return;

    switch(res.res){
        case responses.ALREADY_EXIST:
            alert(messages.COW_ALREADY_EXIST);
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
    let CowID = $("#deleteId p").text();
    let res = await da.DeleteCow(user_id,CowID)

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
        <td hidden class="colRealCowID_class"> <span>${e._id}</span></td>
        <td class="colCowID_class"> <span>${e.Data.CowID}</span></td>
        <td class="colName_class"> <span>${e.Data.Name}</span></td>
        <td class="colAge_class"> <span>${e.Data.Age}</span></td>
        <td class="colBreed_class"> <span>${types[e.Data.Breed]}</span></td>
        <td class="colWeight_class"> <span>${e.Data.Weight}</span></td>
        <td class="colActive_class"> 
            <input disabled type="checkbox" ${e.Data.Active?"checked":""} class="input-group-text" />
        </td>
        <td  ${user_type === 2 || user_type === 3?"hidden":""}> 
            <button class="input-group-text trashCow_class">
                <i class="fa fa-trash"></i>
            </button>
        </td>
        <td  ${user_type === 2 || user_type === 3?"hidden":""}> 
            <button class="input-group-text modifyCow_class">
                <i class="fa fa-pencil"></i>
            </button>
        </td>
        <td> 
            <button class="input-group-text activityCow_class" >
                <i class="fa fa-calendar"></i>
            </button>
        </td>
    </tr>
    `);
}

let modalDelete = (obj, buttonHandler) => {
    let newObj;
    newObj = {
        Name :  obj.closest("td").siblings(".colName_class").find("span").text()||"",
        CowID :  obj.closest("td").siblings(".colCowID_class").find("span").text()||"",
        _id :  obj.closest("td").siblings(".colRealCowID_class").find("span").text()||"",
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
            <p hidden>${newObj.CowID}</p>
            ¿Seguro que deseas eliminar a ${newObj.Name} (${newObj.CowID})?
        </div>
    </div>
`}};

let modalSave =(obj, button)=> {
let newObjflag = false;   
if(obj[0].id == openModalId){
    newObjflag = true;
}
let newObj = {
    _id : !newObjflag? obj.closest("td").siblings(".colRealCowID_class").find("span").text():"",
    CowID : !newObjflag? obj.closest("td").siblings(".colCowID_class").find("span").text():"",
    Active :  obj.closest("td").siblings(".colActive_class").find("input").prop("checked"),
    Name : !newObjflag? obj.closest("td").siblings(".colName_class").find("span").text():"",
    Age : !newObjflag? obj.closest("td").siblings(".colAge_class").find("span").text():"",
    Breed : !newObjflag? obj.closest("td").siblings(".colBreed_class").find("span").text():"",
    Weight : !newObjflag? obj.closest("td").siblings(".colWeight_class").find("span").text():"",
}

return {
"buttonHandler": buttonSave,
"buttonTitle":`${button}`,
"title":"Formulario de Vaca",
"body": 
`
<div class="row" id="modalContent_id" new="${+newObjflag}>
    <div class="col">
        <div class="row needs-validation">
            <div hidden class="col mb-3">
                <label for="idCowReal" class="form-label">_id</label>
                <input type="text" class="form-control" id="idCowReal" value="${newObj._id}">
            </div>
            <div class="col mb-3">
                <label for="idName" class="form-label">Nombre</label>
                <input type="text" maxlength="${lengths.MAX_16}" class="form-control" id="idName" required value="${newObj.Name}">
            </div>
            <div class="col mb-3">
                <label for="idCow" class="form-label">ID de Vaca</label>
                <input type="text" maxlength="${lengths.MAX_8}" class="form-control" id="idCow" required value="${newObj.CowID}">
            </div>
        </div>
        <div class="row needs-validation">
            <div class="col mb-3">
                <label for="idAge" class="form-label">Edad</label>
                <input type="text" class="form-control" id="idAge" required value="${newObj.Age}">
            </div>
            <div class="col mb-3">
                <label for="idWeight" class="form-label">Peso(Kg)</label>
                <input type="number" min=0.0 step="0.01" class="form-control" id="idWeight" required value="${newObj.Weight}">
            </div>
        </div>
        <div class="row">
            <div class="col mb-3">
                <input ${(newObj.Active || newObjflag)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idActive">
                <label class="form-check-label" for="idActive">Activo</label>
            </div>
            <div class="col mb-3">
                <label class="form-check-label" for="idBreed">Raza</label>
                <select class="form-select mt-2" aria-label="" id="idBreed" name="selectorBreed">
                    ${
                        Object.values(types).map((v,i)=>{
                            return (`
                            <option ${newObj.Breed==v?"selected":""} value="${i}">${v}</option>
                            `);
                        })
                    }
                </select>
            </div>
        </div>
        <div class="row mt-3 mb-1">
            <strong>(*) Campos obligatorios</strong> 
        </div>
    </div>
</div>
`
}};

let modalActivity = async(obj, button)=>{

let _id =  obj.closest("td").siblings(".colRealCowID_class").find("span").text();
let Name =  obj.closest("td").siblings(".colName_class").find("span").text();
let CowID =  obj.closest("td").siblings(".colCowID_class").find("span").text();

let params = await da.GetParameters(user_id);
let cowdata = await da.GetCowParamsForDetail(user_id,CowID);
if(cowdata === 0 || params === 0){
    alert(messages.BAD_GATEWAY); return;
}
if(params.length == 0){
    alert(messages.NO_PARAMS_NO_ACTIVITY); return;
}

let arrTemp = "{";
params.forEach((e)=> arrTemp+=`"${e.Data.ParamID}": "<strong>Parámetro</strong>:&nbsp${e.Data.Name}&nbsp&nbsp&nbsp<strong>Unidad</strong>:&nbsp${e.Data.Unit}",`)
arrTemp = arrTemp.slice(0, arrTemp.length-1);
arrTemp += "}"

arrTemp = JSON.parse(arrTemp);
let cowDataDetail = cowdata.map((v,i)=>{
    let FirstValueDate = new Timestamp(v.FirstDataDate.seconds, v.FirstDataDate.nanoseconds) 
    let LastValueDate = new Timestamp(v.LastDataDate.seconds, v.LastDataDate.nanoseconds) 
    return(
        {
            Data:{
                Name: arrTemp[v.ParamID],
                ParamID: v.ParamID,
                FirstValueDate : `${FirstValueDate.toDate().toLocaleDateString()} ${FirstValueDate.toDate().toLocaleTimeString()}`,
                LastValueDate : `${LastValueDate.toDate().toLocaleDateString()} ${LastValueDate.toDate().toLocaleTimeString()}`,
                NumData : v.NumData,
                NumNotifications1 : v.NumDataNotification1,
                NumNotifications2 : v.NumDataNotification2,
                NumNotifications3 : v.NumDataNotification3,
            }   
        }
    )
});

return {
"buttonHandler": buttonSave,
"buttonTitle":`${button}`,
"title":`Detalle de monitoreo de la vaca ${Name} (${CowID})`,
"body": 
`
<div class="row" id="modalContent_id">
    <div class="col">
        <div class="accordion" id="accordionACtivity_id">
            ${cowDataDetail.map(c=>{
             return (
                `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${c.Data.ParamID}_id" aria-expanded="true" aria-controls="${c.Data.Topic}_id">
                        ${c.Data.Name}&nbsp&nbsp&nbsp<strong>ID:</strong>&nbsp${c.Data.ParamID}
                        </button>
                    </h2>
                    <div id="${c.Data.ParamID}_id" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionACtivity_id">
                        <div class="accordion-body">
                            <p>Fecha de primer dato: <strong>${c.Data.FirstValueDate}</strong></p>
                            <p>Fecha de último dato: <strong>${c.Data.LastValueDate}</strong></p>
                            <p># Datos: <strong>${c.Data.NumData}</strong></p>
                            <p># Notificaciones (Ventana Superior): <strong>${c.Data.NumNotifications3}</strong></p>
                            <p># Notificaciones (Ventana Media): <strong>${c.Data.NumNotifications2}</strong></p>
                            <p># Notificaciones (Ventana Inferior): <strong>${c.Data.NumNotifications1}</strong></p>
                        </div>
                    </div>
                </div>
                `
             )   
            }).join("")}
           
        </div>    
       
    </div>
</div>
`
}}


const Cow = async(content)=>{
    pathContent("Administración > Vacas");
    setCurrentPage("adminNavbarDropdown");

    user_id = s.onSession()._id
    user_type = +s.onSession().Data.Type;
    parent_id = s.onSession().Data.parent_id;

    let cows = await da.GetCows(!parent_id?user_id:parent_id);
    if(isResMainError(cows,content)) return;

    $(content).html(
        `
        
        <div id="cowTableDiv_id" class="col">
            <div ${(user_type===2 || user_type===3)?"hidden":""} class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <button type="button" id="${openModalId}" class="btn btn-success text-white">
                        Nueva Vaca
                    </button>
                </div>
            </div>
            <div class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <table id="cowTable_id" class="table-primary table-sm  table-hover">
                        <thead>
                            <tr>
                                <th hidden>_id</th>
                                <th>ID de Vaca</th>
                                <th>Nombre</th>
                                <th>Edad</th>
                                <th>Raza</th>
                                <th>Peso(Kg)</th>
                                <th>Activo</th>
                                <th  ${user_type === 2 || user_type === 3?"hidden":""}>Eliminar</th>
                                <th  ${user_type === 2 || user_type === 3?"hidden":""}>Modificar</th>
                                <th>Actividad</th>
                            </tr>
                        </thead>
                        <tbody> 
                        ${cows.map(e=>{
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

    $(`#${openModalId}`).on("click",async (e)=>{
        BuildModal(modalSave($(e.target),"Registrar"));
    })
}
function UpdateDatatableHandlers(){
    $(".trashCow_class").off()
    $(".modifyCow_class").off();

    $(".trashCow_class").on("click",(e)=>{
        BuildModal(modalDelete($(e.target), buttonDelete));
    })
    $(".modifyCow_class").on("click",(e)=>{        
        BuildModal(modalSave($(e.target),"Modificar"));
    })
    $(".activityCow_class").on("click",async (e)=>{        
        let modal = await modalActivity($(e.target),"Aceptar")
        BuildModal(modal);
    })
}
function CreateDataTable(){
    CowDataTable=$("#cowTable_id").DataTable(customDT(
        {
            "singular":"vaca",
            "plural":"vacas"
        }
    ));
}
function AddRowDataTable(d){
    CowDataTable.destroy();
    $("#cowTable_id tbody").append(rowTemplate(d))    
    UpdateDatatableHandlers();
    CreateDataTable();
}
function UpdateRowDataTable(d){
    CowDataTable.destroy();
    $(`#cowTable_id tbody tr[id=${d._id}]`).remove();
    $("#cowTable_id tbody").append(rowTemplate(d))
    UpdateDatatableHandlers();    
    CreateDataTable();
}
function DeleteRowDataTable(_id){
    CowDataTable.destroy();
    $(`#cowTable_id tbody tr[id=${_id}]`).remove();
    CreateDataTable();
}
function ValidateAge(value){
    return value.toString().match(/[0-9]+/g);
}
function ValidateWeight(value){
    return value;
    //return value.toString().match(/([0-9]*[.])?[0-9]+/g);
}
function BuildModal(modal){
    $("#templateModalLabel").html(modal.title)
    $("#modalBody_id").html(modal.body);
    $("#btnSaveModal_id").html(modal.buttonTitle)
    $("#btnSaveModal_id").off("click");
    $("#btnSaveModal_id").on("click",modal.buttonHandler);
    if($("#idAge").length && $("#idWeight").length){
        $("#idAge").off()
        $("#idWeight").off()
        $("#idAge").on("input",(e)=>$(e.target).val(ValidateAge($(e.target).val())))
        /*
        $("#idWeight").on("input",(e)=>{
            let val = ValidateWeight($(e.target).val())
            $(e.target).val(val)
        })
        */
    }
    if($("#idCow").length){
        $("#idCow").on('keypress', (e) => !(e.which == 32));
    }
    $("#templateModal_id").modal("show");
}


export {Cow}