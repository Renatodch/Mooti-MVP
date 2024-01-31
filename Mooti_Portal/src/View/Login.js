import {responses, messages} from "../utils/responses"
import * as s from "../utils/session";
import { centerObject } from "../utils/general";
import * as da from "../Controller/UserController"

const Login = (content)=>{
    centerObject("body");

    content.html(
    `<div id="homeDiv_id">
        <div id="loginDiv_id">
            <form class="px-4 mt-4">
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <h5 id="loginTitle">MooTI</h5>
                    </div>
                </div>
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <div class="form-group mb-4">
                            <label class="credential_Class mb-1 control-label" for="user_id">
                                Usuario
                            </label>
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-user"></i></span>
                                <input type="text" id="user_id" placeholder="iD de usuario" class="form-control" />
                            </div>
                        </div>
                    </div>
                    </div>
                    
                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <div class="form-group mb-4">
                            <label class="credential_Class mb-1 control-label" for="pass_id">
                                Clave
                            </label>
                            <div class="input-group">
                                <span class="input-group-text" id="basic-addon1"><i class="fa fa-key"></i></span>
                                <input type="password" id="pass_id" placeholder="clave de usuario" class="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col d-flex justify-content-center">
                        <button id="btnLogin_id" type="button" class="btn btn-outline-success mb-4">Iniciar Sesión</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    `);

    $("#btnLogin_id").on("click",async (e)=>{
        let username = $("#user_id").val()
        let pass = $("#pass_id").val()
        if(!username || !pass){
            alert(messages.EMPTY_LOGIN)
            return;
        }

        let res = await da.Login(username,pass);
        //console.log(res)
        if(res==0){
            alert(messages.SERVER_ERROR);
            return;
        }
        //console.log(res.d.Data)
        if(res.d._id!="" && !res.d.Data.Active){
            alert(messages.UNABLE_LOGIN);
            return;    
        }
        switch(res.res){
            case responses.SERVER_ERROR:
                alert(messages.SERVER_ERROR);
                return;
            case responses.SUCCESS_LOGIN:                
                s.setSession(res.d);
                location.reload();
                return;
            case responses.FAILED_LOGIN:
                $("#user_id").val("")
                $("#pass_id").val("")
                alert(messages.FAILED_LOGIN);
            return;
        }   
        
    });
}


export {Login};