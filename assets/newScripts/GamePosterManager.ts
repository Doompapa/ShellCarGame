
import { _decorator, Component, Node, Sprite, LabelComponent, RichTextComponent, resources, Texture2D, ImageAsset, SpriteFrame } from 'cc';
import { Car } from './Car';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
import { Screenshot2D } from './plugin/Screenshot2D';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GamePosterManager
 * DateTime = Mon Mar 28 2022 02:43:12 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = GamePosterManager.ts
 * FileBasenameNoExtension = GamePosterManager
 * URL = db://assets/newScripts/GamePosterManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('GamePosterManager')
export class GamePosterManager extends Component {
    @property({
        type: Sprite
    })
    PosterImage!: Sprite;

    @property({
        type: LabelComponent
    })
    DistanceLabel!: LabelComponent;

    @property({
        type: LabelComponent
    })
    VShellLabel!: LabelComponent;

    @property({
        type: Car
    })
    mainCar!: Car    //获取赛车


    start() {
        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        
        var distance = Math.floor(this.mainCar.node.getWorldPosition().z - 50);

        if (this.mainCar._vshellNumber >= 30) {
            ApiManager.resultType = "智慧";
        } else {
            if (this.mainCar._knockNumber <= 15) {
                ApiManager.resultType = "操作";
            } else {
                //6500m
                if (distance >= 7000) {
                    let isFristPlay = localStorage.getItem("isFristPlay");
                    if (!isFristPlay) {
                        ApiManager.resultType = "天赋";
                    } else {
                        ApiManager.resultType = "实力";
                    }
                } else {
                    ApiManager.resultType = "敏捷";
                }

            }
        }



        // [3]
        this.PosterImage.node.active = false;
        resources.load<Texture2D>("pic/poster/" + ApiManager.resultType + "/texture", (err, resultImage) => {
            let sp = new SpriteFrame();
            sp.texture = resultImage;
            this.PosterImage.spriteFrame = sp;
            this.PosterImage.node.active = true;
        });

        this.DistanceLabel.string = distance.toString();

        // this.VShellLabel.string = "<color=#D02D25><outline color=white width=6><size=66><b>" + this.mainCar._vshellNumber + "</b></size></color>"
        this.VShellLabel.string = this.mainCar._vshellNumber.toString();


        this.scheduleOnce(() => {
            this.getComponent(Screenshot2D)?.showImage();
        }, 0.1)

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

