import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tree')
export class Tree extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    protected onLoad(): void {
        this.updateContent();
    }

    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public updateContent(): void {
        let isShow = this.random(1, 5) >= 3;
        if (isShow) {

            let rotateRandom = Math.floor(Math.random() * 360);
            let rotate = new Vec3(0, rotateRandom, 0);
            this.node.eulerAngles = rotate;

            let scaleRandom = this.random(1, 2);
            this.node.worldScale = new Vec3(scaleRandom, scaleRandom, scaleRandom);
        } else {
            this.node.active = false;
        }
    }

    random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
}
