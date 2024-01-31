
import {router} from './routes/index'

import 'datatables.net-bs5/css/dataTables.bootstrap5.css'
import 'bootstrapv5-multiselect/dist/css/bootstrap-multiselect.css'
import "../scss/styles.scss"
import 'font-awesome/css/font-awesome.css'


window.addEventListener('load',()=>{
    router()
});

window.addEventListener('hashchange',()=>{
    router()
});



