
import { _decorator, Component, Node, Sprite, LabelComponent, RichTextComponent, resources, Texture2D, ImageAsset, SpriteFrame } from 'cc';
import { Car } from './Car';
import { ApiManager } from './plugin/ApiManager';
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
        type: RichTextComponent
    })
    VShellLabel!: RichTextComponent;

    @property({
        type: Car
    })
    mainCar!: Car    //获取赛车


    start() {
        // [3]
        this.PosterImage.node.active = false;
        resources.load<Texture2D>("pic/poster/" + ApiManager.resultType + "/texture", (err, resultImage) => {
            let sp = new SpriteFrame();
            sp.texture = resultImage;
            this.PosterImage.spriteFrame = sp;
            this.PosterImage.node.active = true;
        });

        this.DistanceLabel.string = Math.floor(this.mainCar.node.getWorldPosition().z).toString();

        this.VShellLabel.string = "<color=#D02D25><outline color=white width=6><size=66><b>" + this.mainCar._vshellNumber + "</b></size></color>"

    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

