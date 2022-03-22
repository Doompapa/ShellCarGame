
import { _decorator, Component, Node, loader, Prefab, instantiate, Vec3, find, AssetManager, UITransform } from 'cc';
import { MWComboBox } from '../many-widgets/ComboBox/MW_ComboBox';
import { city } from './data/city';
import { province } from './data/province';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
import { ResourceManager } from './ResourceManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TestManager
 * DateTime = Sun Feb 13 2022 03:01:28 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = TestManager.ts
 * FileBasenameNoExtension = TestManager
 * URL = db://assets/newScripts/TestManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('TestManager')
export class TestManager extends Component {

    @property({
        type: Node
    })
    TestNode!: Node

    start() {
        // [3]

        // this.scheduleOnce(() => {
        //     var my = document.getElementById("content");
        //     let test = document.createElement("img");
        //     test.src = "https://www.doompapa.com/test.png";
        //     test.style.position = "absolute";
        //     test.style.width = "558";
        //     test.style.height = "558";
        //     my!.appendChild(test);
        // }, 0.5);


        let testUI = this.TestNode.getComponent(UITransform);
        if (testUI) {
            // console.log(this.TestNode.position);
            // console.log(testUI.width);
            // console.log(testUI.height);

            let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


            let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
            let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

            console.log(testUI.width * deltaWidth);
            console.log(testUI.height * deltaHeight);

            let offsetY = deltaHeight * this.TestNode.position.y;

            console.log(offsetY);

            let test = document.createElement("img");
            test.src = "https://www.doompapa.com/test.png";
            test.style.position = "absolute";
            // test.style.width = (deltaWidth * 558).toString();
            // test.style.height = (deltaHeight * 558).toString();

            test.style.width = (deltaWidth * testUI.width).toString();
            test.style.height = (deltaHeight * testUI.height).toString();

            //transform:translate(0, -30px)
            test.style.transform = "translate(0, -" + offsetY + "px)";

            GameCanvas!.appendChild(test);

            this.scheduleOnce(() => {
                test.style.display = "none";
            }, 1.5);

        }
    }




    // update (deltaTime: number) {
    //     // [4]
    // }
}
