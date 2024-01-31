enum responses {
  SUCCESS_SAVE = 0,
  ALREADY_EXIST,
  SERVER_ERROR,
  SUCCESS_LOGIN,
  FAILED_LOGIN,
  SUCCESS,
  USER_DONT_EXIST,
  WRONG_IDS_ON_DATA,
  UNEXPECTED_ERROR,
  TELEGRAM_USER_DONT_EXIST,
  PARAMETER_INACTIVE,
  COW_INACTIVE,
  USER_INACTIVE,
  USER_NOT_ADMIN,
}

let telegramMessages ={
   messageConfirmation :  `Gracias por tu mensaje, tu usuario de telegram ha sido activado en el usuario:`,
   messageRejection :  `No fue posible la activación, tu usuario de telegram no se encuentra registrado al usuario:`,
   messageUserDontExist:(user_id:string) => `No fue posible la activación, el usuario: ${user_id}, no existe`,
   messageAlreadyInUse :  `No fue posible la activación, Tu usuario de telegram ya se encuentra asociado al usuario:`,
   messageServerError : "Ocurrió un error intentando activar tu usuario de telegram",
   messageWrongUserSpaces: "El nombre del usuario, grupo de telegram o el mensaje enviado no puede contener espacios",
}

let cowParamMessages ={
  messageSuccess:"Success(0):OK",
  messageSuccessAndNotify:"Success(1):OK y hubo notificacion",
  messageWrongFormat:"Error(1):Formato Invalido",
  messageUserDontExist:"Error(2):El usuario no existe",
  messageErrorServices:"Error(3):Ocurrió un error guardando los datos",
  messageIDsOnDataDontExist:"Error(4):Algunos cow_id o param_id no existen",
  messageSomeServicesDown:"Error(5):Algunos servicios estan caidos",
  messageParameterInactive:"Error(6):Algunos parametros estan inactivos",
  messageCowInactive:"Error(7):Algunas vacas estan inactivas",
  messageUserInactive:"Error(8):Usuario inactivo",
  messageUserIsNotAdmin:"Error(9):El usuario no es administrador",
}

export {
  responses,
  telegramMessages,
  cowParamMessages,
}