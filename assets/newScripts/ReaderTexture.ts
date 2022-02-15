
import { _decorator, Component, Node, RenderTexture, SpriteFrame, Vec3, Sprite, Camera, gfx } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ReaderTexture
 * DateTime = Wed Feb 16 2022 00:17:06 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = ReaderTexture.ts
 * FileBasenameNoExtension = ReaderTexture
 * URL = db://assets/newScripts/ReaderTexture.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('ReaderTexture')
export class ReaderTexture extends Component {
    @property(Sprite)
    modelSprite!: Sprite;
    @property(Camera)
    camera!: Camera;
    @property(Node)
    VShell!: Node;

    private isRotate: boolean = false;


    start() {
        this.isRotate = false;
        this.VShell.active = false;
        this.refreshRenderTexture();
    }
    btnShowPlayerEvent(): void {
        this.VShell.active = true;
    }
    btnHidePlayerEvent(): void {
        this.isRotate = false;
        this.VShell.active = false;
    }
    btnRotatePlayerEvent(): void {
        this.isRotate = true;
    }
    update(deltaTime: number) {
        if (this.isRotate) {
            let eulerAngles: Vec3 = this.VShell.eulerAngles;
            eulerAngles.y++;
            this.VShell.eulerAngles = eulerAngles;
        }
    }

    refreshRenderTexture(): void {
        this.isRotate = false;
        this.VShell.active = false;

        const _colorAttachment = new gfx.ColorAttachment();
        const _depthStencilAttachment = new gfx.DepthStencilAttachment();
        const pi = new gfx.RenderPassInfo([_colorAttachment], _depthStencilAttachment, []);

        let renderTex = new RenderTexture();
        renderTex.reset({
            width: 350,
            height: 610,
            passInfo: pi
        });

        let spriteframe: SpriteFrame = this.modelSprite.spriteFrame!;
        let sp: SpriteFrame = new SpriteFrame();
        sp.reset({
            originalSize: spriteframe.originalSize,
            rect: spriteframe.rect,
            offset: spriteframe.offset,
            isRotate: spriteframe.rotated,
            borderTop: spriteframe.insetTop,
            borderLeft: spriteframe.insetLeft,
            borderBottom: spriteframe.insetBottom,
            borderRight: spriteframe.insetRight,
        });

        this.camera.targetTexture = renderTex;
        sp.texture = renderTex;
        this.modelSprite.spriteFrame = sp;
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
