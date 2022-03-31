
//这里错误可忽略
var mime = { 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp' };
var MAX_HEIGHT = 300;
var spImg: Sprite;
var showImg: Sprite;
var currentUri = "";
var mergedPic: HTMLImageElement;

var showImageElement: HTMLImageElement;
function loadLocalimg(uri: string) {
    //创建一个div   
    var my = document.getElementById("divCreator");
    if (my == null) {
        my = document.createElement("div");
        document.body.appendChild(my);
        my.style.position = "absolute";
        my.id = "divCreator";
        my.style.width = (100).toString();
        my.style.height = (100).toString();
        my.style.backgroundColor = "#ffffcc";
    }
    my.innerHTML = '<img id=imghead>';
    var img = document.getElementById('imghead') as HTMLImageElement;
    img!.onload = function () {
        // let texture = new Texture2D();
        // let imageAsset = new ImageAsset(img as HTMLImageElement);

        // texture.image = imageAsset;

        // let tempSpriteFrame = new SpriteFrame();
        // tempSpriteFrame.texture = texture;

        // spImg.spriteFrame = tempSpriteFrame;

        let canvas = document.createElement('canvas'); // 创建canvas元素
        //限制图片尺寸
        var originWidth = img.width;
        var originHeight = img.height;
        //最大尺寸限制
        var maxWidth = 1080, maxHeight = 1080
        // 目标尺寸
        var targetWidth = originWidth, targetHeight = originHeight;
        //当原始尺寸大于200*200时候
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
                //更宽
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth))
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight))
            }
        }
        canvas.width = targetWidth || 0;
        canvas.height = targetHeight || 0;
        let ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight); // 将图片绘制到canvas中
        }

        let texture = new Texture2D();
        let imageAsset = new ImageAsset(canvas as HTMLCanvasElement);

        texture.image = imageAsset;

        let tempSpriteFrame = new SpriteFrame();
        tempSpriteFrame.texture = texture;

        spImg.spriteFrame = tempSpriteFrame;

        console.log("width=" + imageAsset.width);
        console.log("height=" + imageAsset.height);
    }
    console.log('urlss url [' + uri + ']');
    if (img) {
        (img as HTMLImageElement).src = uri;
    }
    // img.src = uri;
    my.style.display = 'none';
    my.style.visibility = "hidden";
    currentUri = uri;
}

function tmpSelectFile(evt: any) {
    //console.log("image selected...");
    var file = evt.target.files[0];
    var type = file.type;
    if (!type) {
        type = (mime as any)[file.name.match(/\.([^\.]+)$/i)[1]];
    }
    var url = myCreateObjectURL(file);
    //urlss = url;
    loadLocalimg(url);
}

function myCreateObjectURL(blob: Blob) {
    if (window.URL != undefined)
        return window['URL']['createObjectURL'](blob);
    else
        return window['webkitURL']['createObjectURL'](blob);
}


const getBase64 = (url: string) => {
    return new Promise((resolve, reject) => {
        // 通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，避免了文档冗余和污染
        let Img = new Image();
        Img.src = url;
        Img.crossOrigin = 'Anonymous';
        Img.onload = () => { // 要先确保图片完整获取到，这是个异步事件
            let dataURL = '';
            let canvas = document.createElement('canvas'); // 创建canvas元素

            var originWidth = Img.width;
            var originHeight = Img.height;
            //最大尺寸限制
            var maxWidth = 1080, maxHeight = 1080
            // 目标尺寸
            var targetWidth = originWidth, targetHeight = originHeight;
            //当原始尺寸大于200*200时候
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    //更宽
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth))
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight))
                }
            }
            canvas.width = targetWidth || 0;
            canvas.height = targetHeight || 0;

            let ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(Img, 0, 0, targetWidth, targetHeight); // 将图片绘制到canvas中
            dataURL = canvas.toDataURL('image/jpeg'); // 转换图片为dataURL
            resolve(dataURL);
        };
    });
}



import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D, ImageAsset, UITransformComponent, Vec2, Rect, loader, resources, PageView, Input, tween, Vec3, UITransform } from 'cc';
import { Constants } from './Other/constants';
import { HttpUtil } from './Other/HttpUtil';
import { customerListener } from './Other/listener';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;

@ccclass('ShareManager')
export class ShareManager extends Component {

    @property({
        type: Sprite
    })
    img!: Sprite

    @property({
        type: TabControl
    })
    uiControl!: TabControl

    @property({
        type: Node
    })
    ShareUI!: Node

    @property({
        type: Sprite
    })
    ShowImage!: Sprite

    @property({
        type: PageView
    })
    picTemplePageView!: PageView


    @property({
        type: Node
    })
    BoxButton!: Node


    start() {
        // [3]
        customerListener.on(Constants.GameStatus.HIDE_SHARE, this.hideImgHTML, this);

    }

    onLoad() {
        spImg = this.img;
        showImg = this.ShowImage;
    }

    hideImgHTML() {
        if (showImageElement != undefined && showImageElement != null) {
            showImageElement.style.display = "none";
        }

    }

    public onUpload() {
        var fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput == null) {
            fileInput = document.createElement("input");
            fileInput.id = "fileInput";
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.style.height = "0px";
            fileInput.style.display = "block";
            fileInput.style.overflow = "hidden";
            document.body.insertBefore(fileInput, document.body.firstChild);
            fileInput.addEventListener('change', tmpSelectFile, false);
        }
        setTimeout(function () { fileInput.click() }, 100);
    }


    public sendToAI() {

        if (currentUri == "") {
            return;
        }

        var index = (this.picTemplePageView.curPageIdx + 1).toString();

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        // HttpUtil.getToken("http://127.0.0.1:8080/getAccessToken", undefined, (isSuccess, respToken) => {
        HttpUtil.getToken("https://www.doompapa.com/getAccessToken", undefined, (isSuccess, respToken) => {

            if (isSuccess) {
                getBase64(currentUri).then((thumbnail: any) => {
                    //TODO
                    var targetImg = thumbnail.replace(/^data:image\/\w+;base64,/, "");//去掉base64位头部

                    //加载模板图片
                    resources.load<Texture2D>("pic/temple" + index + "/texture", (err, imageTemple) => {
                        // console.log(imageTemple.getHtmlElementObj().toDataURL());
                        this.getBase64ImageByTexture2D(imageTemple, (imageTempleBase64) => {

                            imageTempleBase64 = imageTempleBase64.replace(/^data:image\/\w+;base64,/, "");//去掉base64位头部

                            let param = {
                                'version': '4.0',
                                'image_template': {
                                    'image': imageTempleBase64,
                                    'image_type': 'BASE64'
                                },
                                'image_target': {
                                    'image': targetImg,
                                    'image_type': 'BASE64'
                                },

                            }
                            let paramStr = JSON.stringify(param);

                            this.uiControl.hideSelectPhoto();
                            HttpUtil.post("https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token=" + respToken, paramStr, (isSuccess, resp) => {
                                customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);

                                if ((resp as any)['error_code'] == 0) {

                                    var strImg = "data:image/jpg;base64," + (resp as any)['result']['merge_image'];
                                    //-------------------------------------------

                                    let testUI = showImg.getComponent(UITransform);
                                    if (testUI) {

                                        let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


                                        let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
                                        let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

                                        let offsetY = deltaHeight * showImg.node.position.y;

                                        showImageElement = document.createElement("img");
                                        showImageElement.style.position = "absolute";

                                        // showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
                                        // showImageElement.style.height = (deltaHeight * testUI.height).toString() + "px";

                                        showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
                                        showImageElement.style.height = (deltaWidth * testUI.width / 9 * 16).toString() + "px";

                                        showImageElement.style.transform = "translate(0, -" + offsetY + "px)";
                                        showImageElement.src = strImg;
                                        GameCanvas!.appendChild(showImageElement);
                                    }

                                    //-------------------------------------------

                                    let offset = 15;
                                    let time = 0.05;
                                    tween(this.BoxButton).repeatForever(
                                        tween().by(time, { eulerAngles: new Vec3(0, 0, offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                                            .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                                            .delay(2)
                                    ).start();

                                } else {

                                }

                            });
                        });
                    });

                });
            }

        });
    }


    //获取指定图片地址的base64值，
    public getBase64Image(url: string, callback: (arg0: string) => void) {
        var canvas = document.createElement("CANVAS") as HTMLCanvasElement;
        var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = url;//如：'res/raw-assets/' + "public/skin/frame_1.png"
        img.onload = function () {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL('image/png');
            // canvas = null;
            canvas.style.display = "none";
            if (callback) callback(dataURL);
        }
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

