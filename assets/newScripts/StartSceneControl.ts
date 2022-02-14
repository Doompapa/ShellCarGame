
import { _decorator, Component, Node, ProgressBar, resources, director, Sprite, Widget } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = StartSceneControl
 * DateTime = Mon Feb 14 2022 03:26:48 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = StartSceneControl.ts
 * FileBasenameNoExtension = StartSceneControl
 * URL = db://assets/newScripts/StartSceneControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('StartSceneControl')
export class StartSceneControl extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property({
        type: ProgressBar
    })
    loadBar!: ProgressBar;

    @property({
        type: Widget
    })
    loadLogo!: Widget;

    start() {
        // [3]
        this.loadScene();
        console.log(this.loadBar.totalLength);
    }


    loadScene() {
        resources.loadScene("Scene/main", (completedCount, totalCount, item) => {
            let per = completedCount / totalCount;
            this.loadBar.progress = per;
            this.loadLogo.left = this.loadBar.totalLength * per;
        }, (err, scene) => {
            director.runScene(scene);
        });
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
