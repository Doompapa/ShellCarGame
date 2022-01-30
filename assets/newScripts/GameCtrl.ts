import { _decorator, Component, Node, SystemEventType, Vec2, LabelComponent, CanvasComponent } from 'cc';
import { Car } from './Car';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    private _touchMoveXY: Vec2 = null;
    @property(
        {
            type: Car
        }
    )

    mainCar: Car = null

    public score: number = 0;



    start() {
        this.mainCar.setCamera();
    }

    public clickLeft() {
        // console.log(this.mainCar.node.worldPosition.x);
        //当前在中车道
        if (this.mainCar.node.worldPosition.x == this.mainCar.startPos.worldPosition.x) {
            this.mainCar.setMoveType('left')
            //当前在左车道
        } else if (this.mainCar.node.worldPosition.x == this.mainCar.leftStartPos.worldPosition.x) {
            
            console.log("left 撞墙了");
            //当前在右车道
        } else if (this.mainCar.node.worldPosition.x == this.mainCar.rightStartPos.worldPosition.x) {
            this.mainCar.setMoveType('center')
        }
    }

    public clickRight() {
        //当前在中车道
        if (this.mainCar.node.worldPosition.x == this.mainCar.startPos.worldPosition.x) {
            this.mainCar.setMoveType('right')
            //当前在左车道
        } else if (this.mainCar.node.worldPosition.x == this.mainCar.leftStartPos.worldPosition.x) {
            this.mainCar.setMoveType('center')
            //当前在右车道
        } else if (this.mainCar.node.worldPosition.x == this.mainCar.rightStartPos.worldPosition.x) {
            console.log("right 撞墙了");

        }
    }

    update() {

    }
}
