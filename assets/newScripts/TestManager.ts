
import { _decorator, Component, Node, loader, Prefab, instantiate, Vec3, find } from 'cc';
import { MWComboBox } from '../many-widgets/ComboBox/MW_ComboBox';
import { city } from './data/city';
import { province } from './data/province';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
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

    start() {
        // [3]

        // this.scheduleOnce(() => {
        //     var my = document.getElementById("content");
        //     // if (my == null) {
        //     //     my = document.createElement("div");
        //     //     document.body.appendChild(my);
        //     //     my.style.position = "absolute";
        //     //     my.id = "divCreator";
        //     //     my.style.width = (100).toString();
        //     //     my.style.height = (100).toString();
        //     //     my.style.backgroundColor = "#ffffcc";
        //     // }

        //     //'<img src="http://127.0.0.1/test.jpg" style="width: 591px; height: 1280px;">'
        //     let test = document.createElement("img");
        //     test.src = "http://127.0.0.1/test.jpg";
        //     test.style.position = "absolute";
        //     my!.appendChild(test);
        // }, 0.5);
        ApiManager.GetMemberGD("18627581858");
    }




    // update (deltaTime: number) {
    //     // [4]
    // }
}
