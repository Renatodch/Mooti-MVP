import {resolveRoutes,getHash} from "../utils/general";
import { uris } from "../utils/responses";
import  * as s from "../utils/session";
import Error from "../View/Error";
import { Home  } from "../View/Home";
import { Login  } from "../View/Login";
import { Chart } from "../View/Chart"
import { Cow } from "../View/Cow";
import { Parameter } from "../View/Parameter";
import { User } from "../View/User";
import { Info } from "../View/Info";
const routes = {
    [uris.PAGE_INIT]:Chart,
    [uris.PAGE_INFO]:Info,
    [uris.PAGE_USER]:User,
    [uris.PAGE_COW]:Cow,
    [uris.PAGE_PARAM]:Parameter,
    [uris.PAGE_NOTIFICATION]:Notification,
  }

const router = async()=>{

  let hash = getHash();
  if(hash=='') return;
  let route = resolveRoutes(hash);
  let render = routes[route]?routes[route]:Error("Error");

  if(s.onSession()){

    await Home($('#root'));
    
    $('#navContentDiv_id').html(`
    <div class="col d-flex justify-content-center" style="margin-top:150px">
      <img src='./assets/loading.gif' width="100" height="100"/>
    </div>`);

    if((s.onSession().Data.Type=="2" || s.onSession().Data.Type=="3") && render == User){
      location.hash="";
      render=Chart;
    }
    
    await render('#navContentDiv_id');
    
  }else if(!s.onSession()){
    $("body").css({"background-image": `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%), url("./assets/cows.jpeg")`});
    Login($('#root'));
    location.hash ="";
  }  
}

export {router}