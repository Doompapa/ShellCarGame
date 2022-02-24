
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Mask
 * DateTime = Thu Feb 24 2022 07:06:18 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = Mask.ts
 * FileBasenameNoExtension = Mask
 * URL = db://assets/newScripts/Other/Mask.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Mask')
export class Mask extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start() {
        this.preventMask(); //阻止弹窗mask点击穿透
    }

    preventMask() {
        // this.masks.forEach((item) => {
        //     cc.find(item).on(cc.Node.EventType.TOUCH_START, (e) => {
        //         e.stopPropagation();
        //     })
        //     cc.find(item).on(cc.Node.EventType.TOUCH_MOVE, (e) => {
        //         e.stopPropagation();
        //     })
        // })

        this.node.off(Node.EventType.TOUCH_START);
    
    }


    // update (deltaTime: number) {
    //     // [4]
    // }
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
