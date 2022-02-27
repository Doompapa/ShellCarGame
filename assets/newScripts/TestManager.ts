
import { _decorator, Component, Node, loader, Prefab, instantiate, Vec3, find } from 'cc';
import { MWComboBox } from '../many-widgets/ComboBox/MW_ComboBox';
import { city } from './data/city';
import { province } from './data/province';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
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
    // [1]
    // dummy = '';
    //MWComboBox
    // [2]
    @property({
        type: MWComboBox
    })
    TestComBox!: MWComboBox

    @property({
        type: MWComboBox
    })
    TestComBoxCity!: MWComboBox

    start() {
        // [3]


        // let startTime1 = (new Date).getTime();
        // loader.loadRes("prefabs/Env/GasStation", Prefab, (err: any, prefab: Prefab) => {
        //     if (err) {
        //         console.warn(err);
        //         return;
        //     }
        //     let endTime = (new Date).getTime();
        //     console.log("GasStation" + (endTime - startTime1));

        //     for (var i = 0; i < 5; i++) {
        //         const fab = instantiate(prefab);
        //         fab.parent = this.node;
        //         fab.position = new Vec3(0, 0, 100 * i);
        //         fab.eulerAngles = new Vec3(0, 0, 0);
        //     }
        // });


        // let startTime = (new Date).getTime();
        // loader.loadRes("prefabs/Env/EnvBaseItem", Prefab, (err: any, prefab: Prefab) => {
        //     if (err) {
        //         console.warn(err);
        //         return;
        //     }
        //     let endTime = (new Date).getTime();
        //     console.log("EnvBaseItem " + (endTime - startTime));
        //     for (var i = 0; i < 5; i++) {
        //         const fab = instantiate(prefab);
        //         fab.parent = this.node;
        //         fab.position = new Vec3(0, 0, 100 * i);
        //         fab.eulerAngles = new Vec3(0, 0, 0);
        //     }

        //     // this.initColliderObjects(fab, Constants.ColliderGroup.NORMALCOIN, Constants.ColliderGroup.CAR);
        // });

        // city

        let provinces_data: string[] = [];

        for (var i = 0; i < province.length; i++) {
            provinces_data.push(province[i].name);
        }
        this.TestComBox.setItems(provinces_data);
        this.TestComBoxCity.setItems([]);
        customerListener.on(Constants.GameStatus.CLICK_COMBOXITEM, this.OnSelectProvince, this);
    }



    public OnSelectProvince() {
        // let id = 110000000000;

        let id = '';

        for (var i = 0; i < province.length; i++) {
            if (this.TestComBox.getCurrentText() == province[i].name) {
                // id = Number(province[i].id);
                id = province[i].id;
            }
        }

        if (id != '') {
            let cities_data: string[] = [];

            for (var i = 0; i < city[id].length; i++) {
                cities_data.push(city[id][i].name);
            }

            this.TestComBoxCity.setItems(cities_data);
        }


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
