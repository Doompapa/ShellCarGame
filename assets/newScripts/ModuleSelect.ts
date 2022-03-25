
import { _decorator, Component, Node, ButtonComponent, PageView, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ModuleSelect
 * DateTime = Sun Feb 27 2022 23:37:03 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = ModuleSelect.ts
 * FileBasenameNoExtension = ModuleSelect
 * URL = db://assets/newScripts/ModuleSelect.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('ModuleSelect')
export class ModuleSelect extends Component {

    @property({
        type: PageView
    })
    picTemplePageView!: PageView

    @property({
        type: Node
    })
    BoxButton!: Node

    start() {
        // [3]

        let offset = 15;
        let time = 0.05;
        tween(this.BoxButton).repeatForever(
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

    // update (deltaTime: number) {
    //     // [4]
    // }

    public clickRight() {
        let index = this.picTemplePageView.curPageIdx + 1;
        this.picTemplePageView.setCurrentPageIndex(index);
    }

    public clickLeft() {
        let index = this.picTemplePageView.curPageIdx - 1;
        this.picTemplePageView.setCurrentPageIndex(index);
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
