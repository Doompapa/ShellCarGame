var showImageElement: HTMLImageElement;



import { _decorator, Component, Node, Camera, RenderTexture, director, gfx, ImageAsset, renderer, view, Size, Texture2D, SpriteFrame, Sprite, UITransform, spriteAssembler, sys, Vec2, Canvas, warnID, log, error, Button, assetManager, instantiate, Vec3, Label } from 'cc';
import { JSB, PREVIEW } from 'cc/env';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
const { ccclass, property } = _decorator;

@ccclass('Screenshot2D')
export class Screenshot2D extends Component {

    @property(Camera)
    copyCamera: Camera = null!;

    @property(Node)
    targetNode: Node = null!;

    @property(Node)
    copyNode: Node = null!;


    rt!: RenderTexture;

    _canvas!: HTMLCanvasElement;

    _buffer!: Uint8Array;

    // canvas2image!: Canvas2Image;

    start() {

        this.copyCamera.enabled = false;
    }

    showImage() {
        this.copyCamera.enabled = true;
        // this.canvas2image = Canvas2Image.getInstance();
        this.rt = new RenderTexture();
        this.rt.reset({
            width: view.getVisibleSize().width,
            height: view.getVisibleSize().height,
        })

        this.copyCamera.targetTexture = this.rt;

        this.scheduleOnce(() => {
            this.capture();
        }, 0.5)
    }

    capture() {
        this.copyRenderTex();
    }

    onDisable() {
        if (showImageElement != undefined && showImageElement != null) {
            showImageElement.style.display = "none";
        }

    }

    copyRenderTex() {
        var width = this.targetNode.getComponent(UITransform)!.width;
        var height = this.targetNode.getComponent(UITransform)!.height;

        var worldPos = this.targetNode.getWorldPosition();


        this._buffer = this.rt.readPixels(Math.round(worldPos.x - width / 2), Math.round(worldPos.y - height / 2), width, height) as Uint8Array;

        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
        } else {
            this.clearCanvas();
        }
        let ctx = this._canvas.getContext('2d')!;
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let sRow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = sRow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = this._buffer[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }

        let testUI = this.copyNode.getComponent(UITransform);
        if (testUI) {

            let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


            let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
            let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

            let offsetY = deltaHeight * this.copyNode.position.y;

            showImageElement = document.createElement("img");
            // showImageElement.src = "https://www.doompapa.com/test.png";
            showImageElement.style.position = "absolute";

            showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
            showImageElement.style.height = (deltaHeight * testUI.height).toString() + "px";

            showImageElement.style.transform = "translate(0, -" + offsetY + "px)";
            showImageElement.src = this._canvas.toDataURL("image/jpeg");
            GameCanvas!.appendChild(showImageElement);
        }

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
    }

    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx!.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
