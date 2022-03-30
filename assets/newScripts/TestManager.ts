
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


    compositeImg() {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 800;

        let img1 = new Image();
        let img2 = new Image();
        // img1.src = url;
        // img2.src = require('../../assets/img/qrcode-bg.png');

        img1.complete  //这里可以用这个方法查看所引入图片加载是否完成 完成是返回true，失败false

        console.log('img1', img1.complete)
        console.log('img2', img2.complete)

        setTimeout(() => {
            if (img1.complete && img2.complete) {
                ctx!.drawImage(img2, 0, 0, 500, 800);
                ctx!.drawImage(img1, 120, 310, 256, 270);
            } else {
                console.log('图片加载失败，请重试');
                // this.downloading = false
                return
            }

            // ctx.drawImage(img2, 0, 0, 500, 800);
            // canvas-drawImage 的五个属性 第一个是所需要合并的图片 第二与第三 是X轴与Y轴；四和五 是图片的width和height

            ctx!.stroke()
            //  ctx.stroke() 这个属性很重要，这个是图片画布开始绘制
            let urls = canvas.toDataURL("image/jpg")
            // canvas.toDataURL("image/jpg") 这个是生成新图片的url
            console.log('ctx', urls)
            // this.downloading = false
            this.pictruedowns(urls)
        }, 1000)
        // 设置setTimeout是为了防止图片加载失败的时候，canvas绘制空画布返回
    }

    // 下载图片的方法 很简陋 大佬们别介意
    pictruedowns(url: string) {
        var alink = document.createElement("a");
        alink.href = url;
        alink.download = "qrcode"; //图片名
        alink.click();
    }

}
