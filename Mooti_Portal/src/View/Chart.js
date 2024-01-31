import { pathContent, setCurrentPage } from "../utils/general";
import * as pc from "../Controller/ParameterController";
import * as uc from "../Controller/UserController";
import * as s from "../utils/session"
import * as chart from "../utils/graphs";
import { messages, paths } from "../utils/responses";
import ErrorPage from "./Error";
import { Timestamp } from "firebase/firestore";
import {io} from "socket.io-client"


const socket=io(paths.GATEWAY_WS_URL, {
  reconnectionDelayMax: 10000,
  transports : ['websocket'] 
});

let eventCowParam = "";
let chartRoot;

let param,params,cows,user,user_id,parent_id,active;

const Chart = async(c)=>{
    pathContent("Inicio (Gráfico en tiempo real)");
    setCurrentPage("chartNavLink_id");

    user_id = s.onSession()._id;

    user = await uc.GetUser(user_id);
    if(user === 0){
      $(c).html(ErrorPage(messages.BAD_GATEWAY));return;
    }

    parent_id = user.Data.parent_id;
    active = user.Data.Active;
    if(!active){
      $(c).html(ErrorPage(messages.USER_INACTIVE));return;
    }

    cows = await pc.GetCows(!parent_id?user_id:parent_id);
    params = await pc.GetParameters(!parent_id?user_id:parent_id);
    if(cows === 0 || params === 0){
      $(c).html(ErrorPage(messages.BAD_GATEWAY));return;
    }

    $(c).html(
        `
          <div id="dashboardControlsDiv_id" class="col-12 ">
              <div class="row ms-1 gx-0 px-4  align-items-end justify-content-center">
                <div class="col-auto ">
                  <div class="row mt-4 ps-3">
                    <label class="form-check-label" for="idParam">Seleccione parámetro</label>
                  </div>
                  <div class="row mt-2">
                    <select class="form-select mt-2" aria-label="" id="idParam" name="selectorParam" multiple="multiple">
                        ${
                            params.map((v)=>{
                              return v.Data.Active?(`
                              <option  value="${v.Data.ParamID}" id="${v._id}">${v.Data.Name} (${v.Data.ParamID})</option>
                              `):"";
                            })
                        }
                    </select>   
                  </div>
                </div>
                <div class="col-auto mx-2">
                  <div class="row mt-4 ps-3">
                    <label class="form-check-label" for="idCow">Seleccione la vaca</label>
                  </div>
                  <div class="row mt-2">
                    <select class="form-select" aria-label="" id="idCow" name="selectorCow" multiple="multiple">
                        ${
                          cows.map((v)=>{
                            return v.Data.Active?(`
                            <option  value="${v.Data.CowID}" id="${v.Data.CowID}">${v.Data.Name} (${v.Data.CowID})</option>
                            `):"";
                          })
                        }
                    </select>   
                  </div>
                </div>
                <div class="col-auto ms-3 me-2">
                  <div class="row mt-4 ps-2">
                    <label for="startDate_id">Fecha de inicio</label>
                  </div>
                  <div class="row mt-2">
                    <input id="startDate_id" class="form-control" type="date" />
                  </div>
                </div>
                <div class="col-auto ms-4 me-4">
                  <div class="row mt-4 ps-2">
                    <label for="endDate_id">Fecha de fin</label>
                  </div>
                  <div class="row mt-2">
                    <input id="endDate_id" class="form-control" type="date" />
                  </div>
                </div>
                <div class="col-auto ms-2 me-2 mt-2">
                  <div class="row mt-2">
                    <button type="button" id="idReport" class="btn btn-success text-white">
                        Exportar CSV
                    </button>
                  </div>
                </div>
                <div class="col-auto ms-2 me-2 mt-2" id="loadingCol_id" hidden>
                  <div class="row mt-2">
                    <img src="./assets/loading.gif" width=50 height=35>
                  </div>
                </div>
              </div>
              <div class="row ms-1 gx-0 px-4   justify-content-center">
                <div class="col-12 d-flex justify-content-center" style="height:20px">
                  <h5 id="idChartTitleParam" class="">
                  </h5>
                </div>
                <div class="col-12 d-flex justify-content-center mt-2" style="height:20px">
                  <h5 id="idChartTitleCow" class=""> 
                  </h5>
                </div>
              </div>
              <div class="row ms-1 gx-0 px-2 justify-content-center">
                <div class="col-12 ">
                  <div id="chartDiv_id" >
                  </div>
                    
                </div>

              </div>

          </div>

        `
    );

    
    $('#idParam, #idCow').multiselect({
      numberDisplayed:1,
      nonSelectedText: 'Ninguna seleccionada',
      nSelectedText: 'seleccionadas',
      buttonWidth: 180,
      allSelectedText:'Todas seleccionadas',
      includeSelectAllOption: true,
      
      selectAllText:'Todas',
      enableFiltering: true,
      maxHeight:450,
      filterPlaceholder:"Buscar",
      templates:{
        filter: '<div class="multiselect-filter mt-1 mb-2 mx-2 d-flex align-items-center"><i class="fa fa-search text-muted"></i><input type="search" class="multiselect-search form-control" /></div>',
      }
    });

    await RunChart();
    
    $("select[name=selectorParam], select[name=selectorCow]").on("change",async (e)=>{
      await RunChart();
    });
    
    $("#idReport").on("click",async (e)=>{
      await GenerateReport();
    });
}

async function GenerateReport(){
  let sParam = $("select[name=selectorParam]").val()
  let sCow = $("select[name=selectorCow]").val()
  let startDateStr = $("#startDate_id").val(); //str
  let endDateStr = $("#endDate_id").val();

  startDateStr += startDateStr != "" ?"T00:00:00":"";
  endDateStr += endDateStr != "" ?"T23:59:59":"";
  
  if(startDateStr == "" || endDateStr == "" || sParam == null || sCow == null){
    alert(messages.EMPTY_FIELDS);return;
  }

  let  startDate = new Date(startDateStr);    
  let  endDate = new Date(endDateStr);

  if(endDate<startDate){
    alert(messages.DATE_RANGE_BAD);return;
  }
  
  $("#loadingCol_id").removeAttr("hidden");

  let cowparams = await pc.GetCowParamsForReport(sCow,sParam,user_id, startDateStr, endDateStr);
  //console.log(cowparams)
  if(cowparams === 0){
    alert(messages.BAD_GATEWAY);$("#loadingCol_id").attr("hidden","");return;
  }
  if(cowparams.length === 0){
    alert(messages.NO_COWPARAMS);$("#loadingCol_id").attr("hidden","");return;
  }
  let arr = []

  //cowparams = cowparams.sort((a,b) => a.Data.Datetime.seconds - b.Data.Datetime.seconds)
  //console.log(cowparams)
  cowparams.forEach(cp => {
    let date = new Timestamp(cp.Data.Datetime.seconds, cp.Data.Datetime.nanoseconds) 
    arr.push(
      {
        "Fecha": `${date.toDate().toLocaleDateString()} ${date.toDate().toLocaleTimeString()}`,
        "Vaca ID": cp.Data.CowID,
        "Valor": cp.Data.Value,
        "Parametro ID": cp.Data.ParamID,
        "Ventana Inferior":cp.Data.v1,
        "Ventana Media":cp.Data.v2,
        "Ventana Superior":cp.Data.v3,
      }
    )
  });
  exportData(arr);

  $("#loadingCol_id").attr("hidden","");
}


async function RefreshChart(arg){
  let timestamp = new Timestamp(arg.Data.Datetime.seconds,0)
  let date =  timestamp.toDate();
  chart.addData(arg.Data.Value,date)
}

async function RunChart(){
  let CowID = $("select[name=selectorCow]").val();
  let ParamID = $("select[name=selectorParam]").val();
  //console.log(ParamID)
  if(CowID != null && ParamID != null && CowID.length === 1 && ParamID.length === 1){
    $("#idChartTitleCow").text(`${$(`#${CowID}`).text()}`)

    let param_id = $(`option[value=${ParamID}]`).attr("id");
    param = await pc.GetParameter(param_id);
    if(param === 0){
      alert(messages.BAD_GATEWAY); return;
    }

    socket.off(eventCowParam);
    eventCowParam = `${user_id} ${CowID} ${ParamID}`;
    socket.on(eventCowParam,(data)=>RefreshChart(data))
    
    let prop = {
      unit: param.Data.Unit,
      name:param.Data.Name,
      paramId:param.Data.ParamID,
      lowIndicator:param.Data.LowIndicator,
      highIndicator:param.Data.HighIndicator,
      maxValue:param.Data.MaxValue,
      minValue:param.Data.MinValue,

      chartID : "chartDiv_id",
    }
    chartRoot?.dispose()
    chartRoot = chart.LiveChart(prop);

  }else{
    chartRoot?.dispose()
    $("#idChartTitleCow").text(``)
  }
}

const donwload = function(data){
  const blob = new Blob([data], {type: 'text/csv'})

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute('hidden','');
  a.setAttribute('href',url);
  a.setAttribute('download','reporte.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
const objectToCsv=(data)=>{
  const csvRows = []
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','))
  for(const row of data){
      const values = headers.map(header=>{
          const escaped = (''+row[header]).replace(/"/g, '\\"')
          return `${escaped}`
      });
      csvRows.push(values.join(','));
      //console.log(values.join(','));
  }
  //console.log(csvRows)
  return csvRows.join("\n");
}
const exportData = (data)=>{
  const csvData = objectToCsv(data);
  //console.log(csvData);
  donwload(csvData);
}

export {Chart}