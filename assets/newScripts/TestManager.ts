
import { _decorator, Component, Node, loader, Prefab, instantiate, Vec3, find, AssetManager, UITransform, CameraComponent, Camera, RenderTexture, Sprite, Texture2D, SpriteFrame, ImageAsset } from 'cc';
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

    @property({
        type: Camera
    })
    PosterCamera!: Camera

    start() {

        this.PosterCamera.node.active = false;

        let GameCanvas = document.getElementById('GameDiv') as HTMLElement;

        let showImageElement = document.createElement("img");
        // showImageElement.src = "https://www.doompapa.com/test.png";
        showImageElement.style.position = "absolute";

        showImageElement.style.width = "1080px";
        showImageElement.style.height = "1920px";


        // showImageElement.src = this._screenshot(1080, 1920);
        this.captureNode(this.TestNode);
        GameCanvas!.appendChild(showImageElement);

        // this.scheduleOnce(() => {
        //     var my = document.getElementById("content");
        //     let test = document.createElement("img");
        //     test.src = "https://www.doompapa.com/test.png";
        //     test.style.position = "absolute";
        //     test.style.width = "558";
        //     test.style.height = "558";
        //     my!.appendChild(test);
        // }, 0.5);


        // let testUI = this.TestNode.getComponent(UITransform);
        // if (testUI) {
        //     // console.log(this.TestNode.position);
        //     // console.log(testUI.width);
        //     // console.log(testUI.height);

        //     let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


        //     let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
        //     let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

        //     console.log(testUI.width * deltaWidth);
        //     console.log(testUI.height * deltaHeight);

        //     let offsetY = deltaHeight * this.TestNode.position.y;

        //     console.log(offsetY);

        //     let test = document.createElement("img");
        //     test.src = "https://www.doompapa.com/test.png";
        //     test.style.position = "absolute";
        //     // test.style.width = (deltaWidth * 558).toString();
        //     // test.style.height = (deltaHeight * 558).toString();

        //     test.style.width = (deltaWidth * testUI.width).toString();
        //     test.style.height = (deltaHeight * testUI.height).toString();

        //     //transform:translate(0, -30px)
        //     test.style.transform = "translate(0, -" + offsetY + "px)";

        //     GameCanvas!.appendChild(test);

        //     this.scheduleOnce(() => {
        //         test.style.display = "none";
        //     }, 1.5);

        // }
    }

    /**
     * 截图
     * @param { 摄像机x坐标 } x
     * @param { 摄像机y坐标 } y
     * @param { 视图大小 } orthosize
     * @param { 生成截图宽 } width
     * @param { 生成截图高 } height
     * @returns base64
     */
    _screenshot(width: number, height: number) {

        let camera = this.PosterCamera;
        // 定义
        let texture = new RenderTexture();
        texture.resize(width, height);

        // 设置 targetTexture
        camera.targetTexture = texture;
        // 重新渲染摄像机
        // camera.render();

        // 从 RenderTexture 中读取像素数据
        let pixels = new Uint8Array(width * height * 4);
        let x = texture.width / 2 - width / 2;
        let y = texture.height / 2 - height / 2;
        let w = width;
        let h = height;
        let data = texture.readPixels(pixels, x, y, w, h);

        // 操作数据
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = width;
        canvas.height = height;

        // 写入数据
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        let base64 = canvas.toDataURL('image/png');
        console.log(base64);
        return base64;
    }

    captureNode(nodeCapture: Node) {
        let nodeCamera = new Node();
        nodeCamera.parent = find("Canvas");
        // let camera = nodeCamera.addComponent(CameraComponent);

        let camera = this.PosterCamera;

        let uiTrans = nodeCapture.getComponent(UITransform);

        if (uiTrans) {
            let width = uiTrans.width;
            let height = uiTrans.height;


            let texture = new RenderTexture();
            
            texture.resize(756, 1344);
            // texture.resize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_S8);

            camera.targetTexture = texture;


            let canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;


            let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            // camera.render();


            // 指定需要读取的区域的像素
            // let pixels = new Uint8Array(width * height * 4);
            let x = texture.width / 2 - width / 2;
            let y = texture.height / 2 - height / 2;
            let w = width;
            let h = height;
            let data = texture.readPixels(x, y, w, h);


            if (data) {
                // write the render data
                let rowBytes = width * 4;
                for (let row = 0; row < height; row++) {
                    let srow = height - 1 - row;
                    let imageData = ctx.createImageData(width, 1);
                    let start = srow * width * 4;
                    for (let i = 0; i < rowBytes; i++) {
                        imageData.data[i] = data[start + i];
                    }


                    ctx.putImageData(imageData, 0, row);
                }


                let dataURL = canvas.toDataURL("image/png");
                let img = document.createElement("img") as HTMLImageElement;
                img.src = dataURL;

                let texture2D = new Texture2D();
                let imageAsset = new ImageAsset(img);
                texture2D.image = imageAsset;


                let spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture2D;


                let node = new Node();
                let sprite = node.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;

                return node;
            } else {
                console.log("data = null");

            }


        }


    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
