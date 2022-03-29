
var showImageElement: HTMLImageElement;
var showBorder: Node;


function hechen(text: string, urlData: string, callback: (arg0: string) => void) {
    var mydate = new Date();
    var date = mydate.getFullYear() + '-' + (mydate.getMonth() + 1) + '-' + mydate.getDate();
    let canvas = document.createElement('canvas'); // 创建canvas元素
    var mainCtx = canvas.getContext('2d');

    if (mainCtx != null) {

        mainCtx.clearRect(0, 0, 1000, 1000);
        //因为没法直接读取本地图片 所以做了这部操作

        var starImg = new Image();
        starImg.src = urlData;

        starImg.onload = function () {
            if (mainCtx) {
                //先把图片绘制在这里
                mainCtx.drawImage(starImg, 0, 0, 420, 730);

                //读取用户的文本
                // mainCtx.font = "small-caps bold 28px STXinwei";
                mainCtx.font = "bold 58px";
                // mainCtx.font = "bold 18px";
                //设置用户文本填充颜色
                // (mainCtx as any).font = "bold 28px";
                // (mainCtx as any).color = "black";
                // (mainCtx as any).border = "5px solid white";
                //从坐标点(50,50)开始绘制文字
                (mainCtx as any).fillText(text, 108, 335);
                //设置时间填充颜色
                (mainCtx as any).font = "small-caps bold 16px STXinwei";
                (mainCtx as any).fillText(date, 326, 447);
                if (callback) callback(canvas.toDataURL());
                // return starImg;
            }
        };
    }
}



import { _decorator, Component, Node, loader, Prefab, instantiate, Vec3, find, AssetManager, UITransform, CameraComponent, Camera, RenderTexture, Sprite, Texture2D, SpriteFrame, ImageAsset, view, gfx, Vec2, Rect, resources, Canvas } from 'cc';
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
        type: Camera
    })
    PosterCamera!: Camera

    @property({
        type: Camera
    })
    MainCamera!: Camera

    @property({
        type: Node
    })
    showImg!: Node

    @property({
        type: Canvas
    })
    currentCavans!: Canvas

    _canvas!: HTMLCanvasElement

    private width = 0;
    private height = 0;

    start() {

        showBorder = this.showImg;




        // resources.load<Texture2D>("pic/poster/天赋/texture", (err, imageTemple) => {
        //     this.getBase64ImageByTexture2D(imageTemple, (imageTempleBase64) => {
        //         hechen("测试", imageTempleBase64, (resultImage) => {

        //             let testUI = showBorder.getComponent(UITransform);
        //             if (testUI) {

        //                 let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


        //                 let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
        //                 let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

        //                 let offsetY = deltaHeight * showBorder.position.y;

        //                 showImageElement = document.createElement("img");
        //                 showImageElement.style.position = "absolute";


        //                 showImageElement.style.width = "756px";
        //                 showImageElement.style.height = "1344px";

        //                 // showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
        //                 // showImageElement.style.height = (deltaHeight * testUI.height).toString() + "px";

        //                 showImageElement.style.transform = "translate(0, -" + offsetY + "px)";
        //                 showImageElement.src = resultImage;
        //                 GameCanvas!.appendChild(showImageElement);
        //             }


        //         });



        //     });
        // });

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

    // update (deltaTime: number) {
    //     // [4]
    // }
}
