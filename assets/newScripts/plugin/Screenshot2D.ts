var showImageElement: HTMLImageElement;


import { _decorator, Component, Node, Camera, RenderTexture, director, gfx, ImageAsset, renderer, view, Size, Texture2D, SpriteFrame, Sprite, UITransform, spriteAssembler, sys, Vec2, Canvas, warnID, log, error, Button, assetManager, instantiate, Vec3, Label } from 'cc';
import { JSB, PREVIEW } from 'cc/env';
// import { Canvas2Image } from "./Canvas2Image";
const { ccclass, property } = _decorator;

@ccclass('Screenshot2D')
export class Screenshot2D extends Component {

    @property(Node)
    targetNode: Node = null!;

    @property(Camera)
    copyCamera: Camera = null!;

    @property(Sprite)
    copySprite: Sprite = null!;


    @property(Canvas)
    gameCanvas: Canvas = null!;


    rt!: RenderTexture;

    _canvas: HTMLCanvasElement = null!;

    _buffer!: ArrayBufferView;

    start() {


        // var image = (this.gameCanvas as HTMLCanvasElement).toDataURL("image/png");
        // console.log(image);

        const gameCanvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
        // var image = gameCanvas.toDataURL("image/png");
        // console.log(image);
        SpriteFrame.createWithImage(gameCanvas);



        // this.rt = new RenderTexture();
        // this.rt.reset({
        //     width: view.getVisibleSize().width,
        //     height: view.getVisibleSize().height,
        // })


        // this.copyCamera.targetTexture = this.rt;
        // this.copyCamera.enabled = true;

        // let spriteFrame = new SpriteFrame();
        // spriteFrame.texture = this.rt;

        // this.copySprite.spriteFrame = spriteFrame;

        // this.copyCamera.targetTexture = this.rt;


        // var width = this.targetNode.getComponent(UITransform)!.width;
        // var height = this.targetNode.getComponent(UITransform)!.height;

        // var worldPos = this.targetNode.getWorldPosition();

        // var _buffer = this.rt.readPixels(Math.round(worldPos.x - width / 2), Math.round(worldPos.y - height / 2), width, height);

        // var arrayBuffer = _buffer;

        // if (!this._canvas) {
        //     this._canvas = document.createElement('canvas');
        //     this._canvas.width = width;
        //     this._canvas.height = height;
        // } else {
        //     // this.clearCanvas();
        // }
        // let ctx = this._canvas.getContext('2d')!;
        // let rowBytes = width * 4;
        // for (let row = 0; row < height; row++) {
        //     let sRow = height - 1 - row;
        //     let imageData = ctx.createImageData(width, 1);
        //     let start = sRow * width * 4;
        //     for (let i = 0; i < rowBytes; i++) {
        //         imageData.data[i] = arrayBuffer![start + i];
        //     }
        //     ctx.putImageData(imageData, 0, row);
        // }

        // console.log(this._canvas.toDataURL("image/jpg"));

        // this.getBase64ImageByTexture2D(this.copySprite.spriteFrame.texture as Texture2D, (imageBase64) => {
        //     console.log(imageBase64);
        // });



        // this.captureNew(this.rt);

        // this.scheduleOnce(() => {
        //     this.capture();
        // }, 0.5)
    }

    capture() {
        this.copyRenderTex();
    }

    copyRenderTex() {

        var uiTrans = this.targetNode.getComponent(UITransform);
        if (uiTrans) {
            var width = uiTrans.width;
            var height = uiTrans.height;
            var worldPos = this.targetNode.getWorldPosition();
            this._buffer = this.rt.readPixels(Math.round(worldPos.x), Math.round(worldPos.y), width, height) as ArrayBufferView;

            // this.showImage(width, height);

            let img = new ImageAsset();
            img.reset({
                _data: this._buffer,
                width: width,
                height: height,
                format: Texture2D.PixelFormat.RGBA8888,
                _compressed: false
            });

            let texture = new Texture2D();
            texture.image = img;

            var sp = new SpriteFrame();
            sp.texture = texture;

            this.copySprite.spriteFrame = sp;

            return;

            console.log("width " + texture.width);
            console.log("height " + texture.height);
            //转base64
            this.getBase64ImageByTexture2D(texture, (imageBase64) => {

                let testUI = this.targetNode.getComponent(UITransform);
                if (testUI) {

                    let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


                    let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
                    let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

                    let offsetY = deltaHeight * this.targetNode.position.y;
                    console.log("QRCode " + offsetY);

                    showImageElement = document.createElement("img");
                    showImageElement.style.position = "absolute";

                    showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
                    showImageElement.style.height = (deltaHeight * testUI.height).toString() + "px";

                    // showImageElement.style.transform = "translate(0, -100px)";

                    showImageElement.src = imageBase64;
                    GameCanvas!.appendChild(showImageElement);
                }

            });
        }
    }

    captureNew(texture: RenderTexture) {
        let width = texture.width;
        let height = texture.height;

        let data = texture.readPixels();

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        // this.camera.render();


        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx!.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = (data as any)[start + i];
            }

            ctx!.putImageData(imageData, 0, row);
        }

        var dataURL = canvas.toDataURL("image/jpeg");
        var img = document.createElement("img");
        img.src = dataURL;
        console.log(dataURL)
        return img;
    }

    showImage(width: number, height: number) {
        let img = new ImageAsset();
        img.reset({
            _data: this._buffer,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let texture = new Texture2D();
        texture.image = img;
        let sf = new SpriteFrame();
        sf.texture = texture;
        sf.packable = false;

        var copyNodeSprite = this.copyNode!.getComponent(Sprite);


        if (copyNodeSprite) {

            copyNodeSprite.spriteFrame = sf;
            copyNodeSprite.spriteFrame.flipUVY = true;
            if (sys.isNative && (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX)) {
                copyNodeSprite.spriteFrame.flipUVY = false;
            }
            this.copyNode?.getComponent(UITransform)?.setContentSize(new Size(width, height));
        }

    }


    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx!.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    public getBase64ImageByTexture2D(texture: Texture2D, callback: (arg0: string) => void) {
        var canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        let img = texture.getHtmlElementObj() as HTMLImageElement;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        // canvas = null;
        canvas.style.display = "none";
        if (callback) callback(dataURL);

    }
}
