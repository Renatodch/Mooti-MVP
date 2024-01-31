import * as pc from "../Controller/ParameterController";
import * as s from "../utils/session"
import { setCurrentPage,pathContent,customDT, operationDone, disableButton, isResError, isNoValid, isResMainError, enableButton} from "../utils/general";
import { responses,messages, lengths } from "../utils/responses";
import ErrorPage from "./Error"

let parameters = null;

let openModalId = "btnOpenModalParameter_id";
let ParameterDataTable
let user_id;
let user_type;
let parent_id;

function validations(){

    let Name = $("#idName").val();
    let ParamID = $("#idParam").val();
    let Unit = $("#idUnit").val();
    let Active = $("#idActive").prop("checked");
    let Triggered = 0;
    let EnableN1 = $("#idEnableN1").prop("checked");
    let Message1 = $("#idMessage1").val();
    let EnableN2 = $("#idEnableN2").prop("checked");
    let Message2 = $("#idMessage2").val();
    let EnableN3 = $("#idEnableN3").prop("checked");
    let Message3 = $("#idMessage3").val();   
    let MaxValue = $("#idMaxValue").val();
    let MinValue = $("#idMinValue").val();
    let HighIndicator = $("#idHighIndicator").val();
    let LowIndicator = $("#idLowIndicator").val();
        
    let _id = $("#idParameter").val();

    let fields = document.querySelectorAll('.needs-validation')
    fields.forEach(element => {
        element.classList.add('was-validated');
    });

    
    Message1 = Message1.trim();
    Message2 = Message2.trim();
    Message3 = Message3.trim();
    Name = Name.trim();

    if(Name == "" || ParamID == "" || MaxValue == "" || MinValue == "" || HighIndicator=="" || LowIndicator ==""){
        return null;
    }

    if(MaxValue.includes("-") || MinValue.includes("-") || HighIndicator.includes("-") || LowIndicator.includes("-")){
        return null;
    }
    
    if(!((+MaxValue > +HighIndicator) && (+HighIndicator > +LowIndicator) && (+LowIndicator > +MinValue))){
        alert(messages.INDICATORS_LOGIC);
        return null;
    }
    
    let parameter= {
        Name,ParamID,Unit,Active,user_id,Triggered,EnableN1,Message1,EnableN2,Message2,EnableN3,Message3,
        MaxValue,MinValue,HighIndicator,LowIndicator,   
    };
    let obj={
        Data:parameter,
        _id: _id,
    }
    return obj;
}

let buttonSave=async()=>{
    disableButton("btnSaveModal_id");

    let newObjflag = !!parseInt($("#modalContent_id").attr("new"));
    let obj = validations();

    if(isNoValid(obj, "btnSaveModal_id")) return;
    let res =   await pc.SaveParameter(obj, newObjflag);
    if(isResError(res,"btnSaveModal_id")) return;

    switch(res.res){
        case responses.ALREADY_EXIST:
            alert(messages.PARAMETER_ALREADY_EXIST);
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
    let ParamID = $("#deleteId p").text();        
    let res = await pc.DeleteParameter(user_id, ParamID)
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
        <td class="colParameterID_class" hidden> <span>${e._id}</span></td>
        <td class="colName_class"> <span>${e.Data.Name}</span></td>
        <td class="colParamID_class"> <span>${e.Data.ParamID}</span></td>
        <td class="colActive_class"> 
            <input disabled type="checkbox" ${e.Data.Active?"checked":""} class="input-group-text" />
        </td>
        <td class=""> <span>${e.Data.LowIndicator} - ${e.Data.HighIndicator}</span></td>
        <td hidden class="colHighIndicator_class"> <span>${e.Data.HighIndicator}</span></td>
        <td hidden class="colLowIndicator_class"> <span>${e.Data.LowIndicator}</span></td>
        <td class="colMaxValue_class"> <span>${e.Data.MaxValue}</span></td>
        <td class="colMinValue_class"> <span>${e.Data.MinValue}</span></td>
        <td class="colUnit_class"> <span>${e.Data.Unit}</span></td>
        <td class="px-2"  ${user_type === 2 || user_type === 3?"hidden":""}> 
            <button class=" input-group-text trashParameter_class" >
                <i class="fa fa-trash"></i>
            </button>
        </td>
        <td class="px-2" ${user_type === 2 || user_type === 3?"hidden":""}> 
            <button class="input-group-text modifyParameter_class" >
                <i class="fa fa-pencil"></i>
            </button>
        </td>
        <td hidden class="colEnableN1_class"> 
            <input disabled type="checkbox" ${e.Data.EnableN1?"checked":""} class="input-group-text" />
        </td>
        <td hidden class="colMessage1_class"> <span>${e.Data.Message1}</span></td>
        <td hidden class="colEnableN2_class"> 
            <input disabled type="checkbox" ${e.Data.EnableN2?"checked":""} class="input-group-text" />
        </td>
        <td hidden class="colMessage2_class"> <span>${e.Data.Message2}</span></td>
        <td hidden class="colEnableN3_class"> 
            <input disabled type="checkbox" ${e.Data.EnableN3?"checked":""} class="input-group-text" />
        </td>
        <td hidden class="colMessage3_class"> <span>${e.Data.Message3}</span></td>
    </tr>
    `);
}

let modalDelete = (obj, buttonHandler) => {
    let newObj;
    newObj = {
        Name :  obj.closest("td").siblings(".colName_class").find("span").text()||"",
        ParamID :  obj.closest("td").siblings(".colParamID_class").find("span").text()||"",
        _id :  obj.closest("td").siblings(".colParameterID_class").find("span").text()||"",
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
            <p hidden>${newObj.ParamID}</p>
            ¿Seguro que deseas eliminar a ${newObj.Name} (${newObj.ParamID})?
        </div>
    </div>
`}};

let modalSave = async(obj, button)=> {
let newObjflag = false;   
if(obj[0].id == openModalId){
    newObjflag = true;
}
let newObj = {
    Name : obj.closest("td").siblings(".colName_class").find("span").text(),
    _id :  obj.closest("td").siblings(".colParameterID_class").find("span").text(),
    ParamID :  obj.closest("td").siblings(".colParamID_class").find("span").text(),
    Active :  obj.closest("td").siblings(".colActive_class").find("input").prop("checked"),
    Unit :  obj.closest("td").siblings(".colUnit_class").find("span").text(),
    MaxValue :  obj.closest("td").siblings(".colMaxValue_class").find("span").text(),
    MinValue :  obj.closest("td").siblings(".colMinValue_class").find("span").text(),
    HighIndicator :  obj.closest("td").siblings(".colHighIndicator_class").find("span").text(),
    LowIndicator :  obj.closest("td").siblings(".colLowIndicator_class").find("span").text(),

    EnableN1 : obj.closest("td").siblings(".colEnableN1_class").find("input").prop("checked"),
    Message1 :  obj.closest("td").siblings(".colMessage1_class").find("span").text(),
    EnableN2 : obj.closest("td").siblings(".colEnableN2_class").find("input").prop("checked"),
    Message2 :  obj.closest("td").siblings(".colMessage2_class").find("span").text(),
    EnableN3 : obj.closest("td").siblings(".colEnableN3_class").find("input").prop("checked"),
    Message3 :  obj.closest("td").siblings(".colMessage3_class").find("span").text(),
}

/*
if(!newObjflag){
    let pd = await pc.GetParameter(newObj._id);
    let data = pd.Data;
    cows.forEach((v)=>{
        if(v.Data != undefined){
            v.selected = data.CowArr.includes(v.Data.CowID)
        }
    });
}
*/
return {
"buttonHandler": buttonSave,
"buttonTitle":`${button}`,
"title":"Formulario de Parámetro",
"body": 
`
<div class="row" id="modalContent_id" new="${+newObjflag}">
    <div class="col">
        <div class="row mb-3 needs-validation">
            <div hidden class="col ">
                <label for="idParameter" class="form-label">_id</label>
                <input type="text" class="form-control" id="idParameter" required value="${newObj._id}">
            </div>
            <div class="col ">
                <label for="idName" class="form-label">Nombre *</label>
                <input type="text" maxlength="${lengths.MAX_32}" class="form-control" id="idName" required value="${newObj.Name}">
            </div>
            <div class="col ">
                <label for="idParam" class="form-label">Identificador *</label>
                <input type="text" maxlength="${lengths.MAX_8}" class="form-control" id="idParam" required value="${newObj.ParamID}">
            </div>
            <div class="col-3 ">
                <label for="idUnit" class="form-label">Unidades *</label>
                <input  type="text" maxlength="${lengths.MAX_16}" class="form-control" id="idUnit" required value="${newObj.Unit}">
            </div>
        </div>
        <div class="row  mt-2">
            <div class="col">
                <div class="row">
                    <div class="col">
                        <input ${(newObj.Active || newObjflag)?"checked":""} type="checkbox" class="form-check-input" value="true" id="idActive">
                        <label class="form-check-label" for="idActive">Activo</label>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div class="row ">
            <div class="col d-flex justify-content-center">
                <div ><strong>Notificaciones</strong></div>
                
            </div>
        </div>
        <div class="row mt-3 mb-1">
            <div class="col ">
                <label  class="form-label">Activos</label>
            </div>
            <div class="col ">
                <label  class="form-label">Mensajes</label>
            </div>
            <div class="col-3 ">
                <label  class="form-label">Indicadores *</label>
            </div>
        </div>

        <div class="row align-items-start">
            <div class="col">
                <div class="row  pt-2 pb-4 v3">
                    <div class="col-2 d-flex align-items-center">
                        <input ${newObj.EnableN3===true?"checked":""} type="checkbox" class="form-check-input" value="true" id="idEnableN3">
                        <label class="form-check-label mx-2" for="idEnableN3">  </label>
                    </div>
                    <div class="col ">
                        <label for="idMessage3" class="form-label">   </label>
                        <textarea maxlength="${lengths.MAX_64}" placeholder="Cuando el parametro se encuentra en la ventana superior" class="form-control" id="idMessage3" required value="">${newObj.Message3}</textarea>
                    </div>
                </div>
                <div class="row pt-4 pb-5 v2">
                    <div class="col-2 d-flex align-items-center">
                        <input ${newObj.EnableN2===true?"checked":""} type="checkbox" class="form-check-input" value="true" id="idEnableN2">
                        <label class="form-check-label mx-2" for="idEnableN2">  </label>
                    </div>
                    <div class="col ">
                        <label for="idMessage2" class="form-label">  </label>
                        <textarea maxlength="${lengths.MAX_64}" placeholder="Cuando el parametro se encuentra en la ventana media" class="form-control" id="idMessage2" required value="">${newObj.Message2}</textarea>
                    </div>
                </div>
                <div class="row pt-2 pb-4 v1">
                    <div class="col-2 d-flex align-items-center">
                        <input ${newObj.EnableN1===true?"checked":""} type="checkbox" class="form-check-input" value="true" id="idEnableN1">
                        <label class="form-check-label mx-2" for="idEnableN1">  </label>
                    </div>

                    <div class="col ">
                        <label for="idMessage1" class="form-label">  </label>
                        <textarea  maxlength="${lengths.MAX_64}" placeholder="Cuando el parametro se encuentra en la ventana inferior" class="form-control" id="idMessage1" required value="">${newObj.Message1}</textarea>
                    </div>

                </div>
                
            </div>

            
            <div class="col-3 needs-validation" >
                <div class="row pt-3 pb-5 v3 " >
                    <div class="col ">
                        <!-- <label for="idMaxValue" class="form-label">Máx</label> -->
                        <input placeholder="maximo" type="number" min=0.0 step="0.01" class="form-control" id="idMaxValue" required value="${newObj.MaxValue}"> 
                    </div>
                </div>
                <div class="row pt-3  v3">
                
                </div>
                <div class="row pb-5 v2 ">  
                    <div class="col ">
                        <!-- <label for="idHighIndicator" class="form-label">Superior</label> -->
                        <input placeholder="superior" type="number" min=0.0 step="0.01" class="form-control" id="idHighIndicator" required value="${newObj.HighIndicator}">
                    </div> 
                </div>
                <div class="row pb-3 v2">
                
                </div>
                <div class="row  v2 "  style="padding-top:18px">  
                    <div class="col ">
                        <!-- <label for="idLowIndicator" class="form-label">Inferior</label> -->
                        <input  placeholder="inferior" type="number" min=0.0 step="0.01" class="form-control" id="idLowIndicator" required value="${newObj.LowIndicator}">
                    </div>       
                </div>
                <div class="row pt-4 pb-3 v1">
                
                </div>
                <div class="row  pt-4 pb-3 v1">  
                    <div class="col ">
                        <!-- <label for="idMinValue" class="form-label">Mín</label> -->
                        <input  placeholder="minimo" type="number" min=0.0 step="0.01" class="form-control" id="idMinValue" required value="${newObj.MinValue}">
                    </div>    
                </div>
                
            </div>
            
        </div>
        <div class="row mt-3 mb-1">
            <strong>(*) Campos obligatorios</strong> 
        </div>
        
    </div>
</div>
`
}};




const Parameter = async(content)=>{
    pathContent("Administración > Parámetros");
    setCurrentPage("adminNavbarDropdown");

    user_id = s.onSession()._id;
    user_type = +s.onSession().Data.Type;
    parent_id = s.onSession().Data.parent_id;

    parameters = await pc.GetParameters(!parent_id?user_id:parent_id);
    if(isResMainError(parameters,content)) return;


    $(content).html(
        `
        <div id="parameterTableDiv_id" class="col">
            <div ${(user_type===2 || user_type===3)?"hidden":""} class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <button type="button" id="${openModalId}" class="btn btn-success text-white">
                        Nuevo Parámetro
                    </button>
                </div>
            </div>
            <div class="row mb-4 gx-0">
                <div class="col d-flex justify-content-center">
                    <table id="parameterTable_id" class="table-primary table-sm  table-hover">
                        <thead>
                            <tr>
                                <th hidden>ID de Parámetro</th>
                                <th>Nombre</th>
                                <th>Identificador</th>
                                <th>Activo</th>
                                <th>Ventana Principal</th>
                                <th hidden>Máximo Indicator</th>
                                <th hidden>Mínimo Indicator</th>
                                <th>Valor Maximo</th>
                                <th>Valor Mínimo</th>
                                <th>Unidades</th>
                                <th ${user_type === 2 || user_type === 3?"hidden":""}>Eliminar</th>
                                <th ${user_type === 2 || user_type === 3?"hidden":""}>Modificar</th>
                                <th hidden>EnableN1</th>
                                <th hidden>Mensaje1</th>
                                <th hidden>EnableN2</th>
                                <th hidden>Mensaje2</th>
                                <th hidden>EnableN3</th>
                                <th hidden>Mensaje3</th>
                            </tr>
                        </thead>
                        <tbody> 
                        ${parameters.map(e=>{
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
        let modal = await modalSave($(e.target),"Registrar");        
        BuildModal(modal);
    })
}
function UpdateDatatableHandlers(){
    $(".trashParameter_class").off()
    $(".modifyParameter_class").off();

    $(".trashParameter_class").on("click",(e)=>{
        BuildModal(modalDelete($(e.target), buttonDelete));
    })
    $(".modifyParameter_class").on("click",async (e)=>{ 
        let modal = await modalSave($(e.target),"Modificar");        
        BuildModal(modal);
    })
}
function CreateDataTable(){
    ParameterDataTable=$("#parameterTable_id").DataTable(customDT(
        {
            "singular":"parametro",
            "plural":"parametros"
        }
    ));
}
function AddRowDataTable(d){
    ParameterDataTable.destroy();
    $("#parameterTable_id tbody").append(rowTemplate(d))    
    UpdateDatatableHandlers();
    CreateDataTable();
}
function UpdateRowDataTable(d){
    ParameterDataTable.destroy();
    $(`#parameterTable_id tbody tr[id=${d._id}]`).remove();
    $("#parameterTable_id tbody").append(rowTemplate(d))
    UpdateDatatableHandlers();    
    CreateDataTable();
}
function DeleteRowDataTable(_id){
    ParameterDataTable.destroy();
    $(`#parameterTable_id tbody tr[id=${_id}]`).remove();
    CreateDataTable();
}

function BuildModal(modal){
    $("#templateModalLabel").html(modal.title)
    $("#modalBody_id").html(modal.body);

    $("#btnSaveModal_id").html(modal.buttonTitle)
    $("#btnSaveModal_id").off("click");
    $("#btnSaveModal_id").on("click",modal.buttonHandler);
    
    if($("#idMaxValue").length){
        /*
        $("#idMaxValue").off()
        $("#idMaxValue").on("input",(e)=>{
            let val = $(e.target).val()
            $(e.target).val(val)
        })
        $("#idMinValue").off()
        $("#idMinValue").on("input",(e)=>{
            let val = $(e.target).val()
            $(e.target).val(val)
        })
        $("#idHighIndicator").off()
        $("#idHighIndicator").on("input",(e)=>{
            let val = $(e.target).val()
            $(e.target).val(val)
        })
        $("#idLowIndicator").off()
        $("#idLowIndicator").on("input",(e)=>{
            let val = $(e.target).val()
            $(e.target).val(val)
        })
        */
    }
    if($("#idParam").length){
        $("#idParam").on('keypress', function(e) {
            if (e.which == 32){
                return false;
            }
        });
    }

    $("#templateModal_id").modal("show");

}


export {Parameter}