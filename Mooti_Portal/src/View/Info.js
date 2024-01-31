import { setCurrentPage } from "../utils/general";
import { pathContent } from "../utils/general";

const Info = async(content)=>{
    pathContent("Fuentes IoT Info");
    setCurrentPage("infoNavLink_id")
    $(content).html(
        `
        <div id="info_id" class="col-12 mt-4 container">
            <div class="row mx-2  justify-content-start">
                <div class="col alert alert-warning">
                    <div>⚠️<strong>El servicio de monitoreo de la salud de las vacas es compatible
                    con fuentes que utilicen protocolo HTTP o MQTT para el envío de los datos
                    de acuerdo al siguiente formato JSON en texto plano:
                    </strong></div>
                </div>
            </div>
            <div class="row mx-2 justify-content-center">
                <div class="col-5">
                    <img src="./assets/dataFormat.png" alt="format" width="500" height="250"/>
                </div>
            </div>
            <div class="row mx-2 mb-1">
                <div class="col">
                    <p>
                        <div class="alert alert-info info_class" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMqttInfo" aria-expanded="false" aria-controls="collapseMqttInfo">
                            <h5>Fuentes con protocolo <span class="badge bg-secondary">MQTT</span></h5>
                        </div>
                    </p>
                    <div class="collapse" id="collapseMqttInfo">
                        <div class="card card-body">
                            <div>Podrán hacer llegar la información sin autenticación publicando en la dirección de la puerta de enlace en el puerto <strong>8765</strong>, 
                            con una calidad de servicio (QoS) de <strong>0</strong>,
                            en el id de usuario un identificador único del dispositivo,
                            y en el payload los datos de envío.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mx-2 mb-4">
                <div class="col">
                    <p>
                        <div class="alert alert-light info_class" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHttpInfo" aria-expanded="false" aria-controls="collapseHttpInfo">
                            <h5>Fuentes con protocolo <span class="badge bg-secondary">HTTP</span></h5>
                        </div>
                    </p>
                    <div class="collapse" id="collapseHttpInfo">
                        <div class="card card-body">
                            <div>
                            Podrán hacer llegar los datos mediante el método <strong>POST</strong> sin autenticación
                            en la dirección de la puerta de enlace en el puerto <strong>8764</strong>
                            con la siguiente cabecera: <strong>Content-Type: 'text/plain'</strong>,
                            y en el body los datos de envio
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        <div>
        `
    );
}


export {Info}