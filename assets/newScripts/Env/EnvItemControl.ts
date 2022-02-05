import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnvItemControl')
export class EnvItemControl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    //广告牌控制
    @property({
        type: Node,
    })
    adBoard1: Node = null

    @property({
        type: Node,
    })
    adBoard2: Node = null


    start() {
        // Your initialization goes here.
        this.updateRandom();
    }

    public updateRandom() {
        // let randomAd = this.random(1, 5);
        // if (randomAd <= 2) {
        //     this.adBoard1.active = false;
        //     this.adBoard2.active = false;
        // } else {
        //     if (randomAd <= 3) {
        //         this.adBoard1.active = true;
        //         this.adBoard2.active = false;
        //     } else {
        //         this.adBoard1.active = false;
        //         this.adBoard2.active = true;
        //     }
        // }
        console.log("updateRandom");
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
}
