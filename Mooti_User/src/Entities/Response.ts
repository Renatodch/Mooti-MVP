import { responses } from "../utils/responses";
import {Entity} from "./Entity"

class Response<T>{
    res:responses;
    d:Entity<T>;
    constructor(d:Entity<T>, res:responses){
        this.d = d ;
        this.res = res ;
    }
}

export {Response}