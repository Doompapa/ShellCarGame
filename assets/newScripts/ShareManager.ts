
//这里错误可忽略
var mime = { 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp' };
var MAX_HEIGHT = 300;
var spImg: Sprite;
var showImg: Sprite;
var currentUri = "";
var mergedPic: HTMLImageElement;
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

function tmpSelectFile(evt) {
    //console.log("image selected...");
    var file = evt.target.files[0];
    var type = file.type;
    if (!type) {
        type = mime[file.name.match(/\.([^\.]+)$/i)[1]];
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

function downloadIamge(image: HTMLImageElement) {
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
        // 生成一个a元素
        var a = document.createElement('a')
        // 创建一个单击事件
        var event = new MouseEvent('click')
        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = '我的个性海报.png'
        // 将生成的URL设置为a.href属性
        a.href = image.src
        // 触发a的单击事件
        a.dispatchEvent(event)
    }

}




import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D, ImageAsset, UITransformComponent, Vec2, Rect, loader, resources } from 'cc';
import { Constants } from './Other/constants';
import { HttpUtil } from './Other/HttpUtil';
import { customerListener } from './Other/listener';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = ShareManager
 * DateTime = Wed Feb 23 2022 23:10:34 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = ShareManager.ts
 * FileBasenameNoExtension = ShareManager
 * URL = db://assets/newScripts/ShareManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('ShareManager')
export class ShareManager extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

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

    start() {
        // [3]
    }

    onLoad() {
        spImg = this.img;
        showImg = this.ShowImage;
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

        //http://124.222.110.161:8080/getAccessToken
        //https://www.doompapa.com/getAccessToken

        //24.7a80557235b4004c8c39e165cbf51255.2592000.1648243624.282335-25649206
        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        // HttpUtil.getToken("http://124.222.110.161:8080/getAccessToken", undefined, (isSuccess, respToken) => {
        // console.log(respToken);
        var respToken = "24.7a80557235b4004c8c39e165cbf51255.2592000.1648243624.282335-25649206";
        getBase64(currentUri).then((thumbnail: any) => {
            //TODO
            var targetImg = thumbnail.replace(/^data:image\/\w+;base64,/, "");//去掉base64位头部

            //加载模板图片
            resources.load<Texture2D>("pic/temple/texture", (err, imageTemple) => {
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

                        if (resp['error_code'] == 0) {

                            var strImg = "data:image/jpg;base64," + resp['result']['merge_image'];

                            let my = document.getElementById("divCreator");
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
                            let img = document.getElementById('imghead');
                            img!.onload = function () {
                                let texture = new Texture2D();
                                let imageAsset = new ImageAsset(img as HTMLImageElement);
                                texture.image = imageAsset;

                                let tempSpriteFrame = new SpriteFrame();
                                tempSpriteFrame.texture = texture;
                                showImg.spriteFrame = tempSpriteFrame;
                                mergedPic = img as HTMLImageElement;
                            }

                            if (img) {
                                (img as HTMLImageElement).src = strImg;
                            }

                            my.style.display = 'none';
                            my.style.visibility = "hidden";
                            
                        } else {
                            
                        }

                    });
                });
            });

        });
        // });


    }

    public savePic() {
        downloadIamge(mergedPic);
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
            canvas = null;
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
        canvas = null;
        if (callback) callback(dataURL);

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
