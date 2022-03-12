
import { _decorator, Component, Node, tween, Tween, Vec3, UIOpacityComponent, LabelComponent } from 'cc';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RewardManager
 * DateTime = Sun Mar 13 2022 02:30:10 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = RewardManager.ts
 * FileBasenameNoExtension = RewardManager
 * URL = db://assets/newScripts/RewardManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('RewardManager')
export class RewardManager extends Component {
    @property({
        type: Node
    })
    Box!: Node

    @property({
        type: Node
    })
    ReceiveRewardUI!: Node

    @property({
        type: Node
    })
    EffectsNode!: Node

    @property({
        type: Node
    })
    Ticket!: Node

    @property({
        type: LabelComponent
    })
    TicketLabel!: LabelComponent

    private boxTween !: Tween<Node>;


    start() {
        // [3]
        this.ReceiveRewardUI.active = false;
        this.EffectsNode.active = false;
        this.Ticket.active = false;

        //宝箱动画
        let offset = 15;
        let time = 0.05;
        this.boxTween = tween(this.Box).repeatForever(
            tween().by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .delay(2)
        ).start();
    }
    /**
     * 打开宝箱
     */
    public OpenBox() {
        this.boxTween.stop();
        this.EffectsNode.active = true;
        // this.ReceiveRewardUI.active = true;

        let gameOverOpacity = this.ReceiveRewardUI.getComponent(UIOpacityComponent);
        if (gameOverOpacity != null) {
            gameOverOpacity.opacity = 0;
            this.ReceiveRewardUI.active = true;
            // tween(gameOverOpacity).by(0.5, { worldScale: new Vec3(1, 1, 1) }).start();
            tween(gameOverOpacity).by(1.5, { opacity: 255 }).start();
        }

        this.Ticket.worldScale = new Vec3(0, 0, 0);
        this.Ticket.active = true;
        tween(this.Ticket).by(1.5, { worldScale: new Vec3(1, 1, 1) }).start();

    }


}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
