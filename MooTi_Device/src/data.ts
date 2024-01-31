import { Cow, _Cow } from "./entity/Cow";
import { GetRandomValue } from "./utils/utils";

let user_id="arom";
let cows:Array<Cow> = []
let numberOfCows = 300;
function makeCowID(){
    for(let i=1; i<numberOfCows+1; i++){
        let cow:Cow = new Cow(
            `v${i.toString().padStart(3,"0")}`,
            `miVaca${i}`,
            Math.round(+GetRandomValue(12)),
            0,
            Math.round(+GetRandomValue(400)),
            true,
            user_id,
        );
        cows.push(cow);
    }
}
makeCowID();

export {
    cows,
    numberOfCows
}