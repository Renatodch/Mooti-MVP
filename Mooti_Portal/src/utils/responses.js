//const URL_APIGATEWAY = "mooti-apigateway.eastus.azurecontainer.io";
const URL_APIGATEWAY = "localhost";

console.log(URL_APIGATEWAY);

const responses = {
    SUCCESS_SAVE:0,
    ALREADY_EXIST:1,
    SERVER_ERROR:2,
    SUCCESS_LOGIN:3,
    FAILED_LOGIN:4,
    SUCCESS: 5,
    USER_DONT_EXIST: 6,
    WRONG_IDS_ON_DATA: 7,
    UNEXPECTED_ERROR: 8,
}
const lengths = {
    MAX_8:8,
    MAX_16:16,
    MAX_24:24,
    MAX_32:32,
    MAX_48:48,
    MAX_64:64,
}
const messages = {
    WEIGHT_BAD_FORMAT: "Valor no permitido en el peso",
    INDICATORS_LOGIC: "El valor de los indicadores debe ser descendente desde la ventana roja hasta la amarilla ",
    UNABLE_LOGIN:"Cuenta Desactivada",
    USER_ALREADY_EXIST:"Ya existe un usuario con el mismo ID",
    PARAMETER_ALREADY_EXIST:"Ya existe un parametro con el mismo identificador",
    COW_ALREADY_EXIST:"Ya existe una vaca con el mismo ID",
    SERVER_ERROR:"Ocurrió un error en el servidor",
    EMPTY_FIELDS:"Falta completar campos",
    EMPTY_LOGIN:"Falta llenar datos de autenticacion",
    FAILED_LOGIN:"Usuario o clave inválido(s)",
    EMPTY_MESSAGE_NOTIFICATION:"El mensaje de la notificación no puede estar vacío si se habilitan las notificaciones",
    DATE_RANGE_BAD:"Error en rango de fechas",
    COW_INVALID_CHAR:"El id de la vaca no puede contener los siguientes caracteres: -",
    CANT_DELETE_YOUR_OWN_USER:"No puedes borrar tu usuario mientras estes en sesión",
    BAD_GATEWAY:"Bad Gateway",
    SPACE_IN_COWID:"El id de la vaca no puede contener espacios",
    SPACE_IN_PARAMID:"El id del parametro no puede contener espacios",
    SPACE_IN_USERID:"El id del usuario no puede contener espacios",
    NO_COWPARAMS:"No se encuentran datos",
    NO_PARAMS_NO_ACTIVITY: "Aun no se han registrado parámetros",
    USER_INACTIVE:"Tu usuario ha sido desactivado"

}

const paths ={
    GATEWAY_HTTP_URL:`http://${URL_APIGATEWAY}:8888`,
    GATEWAY_WS_URL:`ws://${URL_APIGATEWAY}:8777`,
    URI_INIT:'/',
    URI_USER:'/user',
    URI_LOGIN:'/login',
    URI_WORKER:'/worker',
    URI_DASHBOARD:'/dashboard',
    URI_COW:'/cow',
    URI_COWPARAM:'/mooti',
    URI_PARAM:'/param',

    URI_DETAIL_PARAM:'/detailparam',
};

const uris = {
    PAGE_INIT:'/',
    PAGE_INFO:'/info',
    PAGE_USER:'/user',
    PAGE_DASHBOARD:'/dashboard',
    PAGE_COW:'/cow',
    PAGE_COWPARAM:'/cowparam',
    PAGE_CHART:'/chart',
    PAGE_PARAM:'/param',
    PAGE_NOTIFICATION:'/notification',
};
export {messages, responses, paths, uris, lengths}