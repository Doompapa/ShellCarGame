
import { _decorator, Component, Node, Sprite, RenderTexture, SpriteFrame, Camera, Rect, view, Canvas, UITransform, Widget, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Instruction
 * DateTime = Tue Feb 15 2022 23:00:40 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = Instruction.ts
 * FileBasenameNoExtension = Instruction
 * URL = db://assets/newScripts/Instruction.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('Instruction')
export class Instruction extends Component {
    // [1]
    // dummy = '';

    @property({
        type: Sprite
    })
    VShellSprite!: Sprite;

    @property({
        type: Camera
    })
    renderCamera!: Camera;

    @property({
        type: RenderTexture
    })
    renderTex!: RenderTexture

    @property({
        type: Canvas
    })
    currentCavans!: Canvas

    start() {
        // [3]
        // console.log(this.VShellSprite.getComponent(Widget)?._lastSize);
        console.log(this.currentCavans.getComponent(UITransform)?.height);
        console.log();
        this.renderCamera.enabled = false;
        this.VShellSprite.node.active = false;




        let width = this.currentCavans.getComponent(UITransform)?.width;
        let height = this.currentCavans.getComponent(UITransform)?.height;

        let renderTex = new RenderTexture();

        if (width && height) {
            renderTex.reset({
                width: width,
                height: height
            });
            this.renderCamera.targetTexture = renderTex;

            this.scheduleOnce(() => {
                this.renderCamera.enabled = true;
                if (renderTex) {
                    let spriteFrame = new SpriteFrame();
                    spriteFrame.texture = renderTex;

                    // this.VShellSprite.node.eulerAngles = new Vec3(0, 0, 180);

                    this.VShellSprite.spriteFrame = spriteFrame;
                    this.VShellSprite.node.active = true;
                }

            }, 2);
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
