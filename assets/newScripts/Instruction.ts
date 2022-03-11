
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
        type: Node
    })
    VShellNode!: Node;

    @property({
        type: Sprite
    })
    VShellSprite!: Sprite;


    @property({
        type: Node
    })
    KnockNode!: Node;
    @property({
        type: Sprite
    })
    KnockSprite!: Sprite;

    @property({
        type: Sprite
    })
    CarSprite!: Sprite;

    @property({
        type: Camera
    })
    renderCamera!: Camera;

    @property({
        type: Canvas
    })
    currentCavans!: Canvas


    @property({
        type: Node
    })
    StartTipNode!: Node

    /**
     * 当前步骤
     */
    private step = 0;

    private width = 0;
    private height = 0;


    start() {
        this.renderCamera.enabled = false;
        this.VShellSprite.node.active = false;
        this.KnockSprite.node.active = false;
        this.CarSprite.node.active = false;

        let width = this.currentCavans.getComponent(UITransform)?.width;
        let height = this.currentCavans.getComponent(UITransform)?.height;

        if (width && height) {
            this.width = width;
            this.height = height;
        }
        this.showNextStep();
    }

    public clickNextStep() {
        this.step++;
        this.showNextStep();
    }

    showNextStep() {
        let renderTex = new RenderTexture();
        renderTex.reset({
            width: this.width,
            height: this.height
        });
        this.renderCamera.targetTexture = renderTex;
        this.renderCamera.enabled = true;

        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = renderTex;


        switch (this.step) {
            case 0:
                this.KnockNode.active = false;
                this.KnockSprite.node.active = false;
                this.CarSprite.node.active = false;

                this.VShellNode.active = true;
                this.VShellSprite.spriteFrame = spriteFrame;
                this.VShellSprite.node.active = true;
                break;
            case 1:
                this.VShellNode.active = false;
                this.VShellSprite.node.active = false;
                this.CarSprite.node.active = false;

                this.KnockNode.active = true;
                this.KnockSprite.spriteFrame = spriteFrame;
                this.KnockSprite.node.active = true;
                break;
            case 2:
                this.KnockNode.active = false;
                this.KnockSprite.node.active = false;
                this.VShellNode.active = false;
                this.VShellSprite.node.active = false;

                this.CarSprite.node.active = true;
                this.CarSprite.spriteFrame = spriteFrame;
                break;
            default:
                this.StartTipNode.active = true;
                //展示开始界面
                localStorage.setItem("isFristPlay", "true");
                this.node.active = false;
                break;

        }
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
