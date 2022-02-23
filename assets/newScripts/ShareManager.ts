
//这里错误可忽略
var mime = { 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp' };
var selectedHandler;
var bytesHandler;
var thisRef;
var MAX_HEIGHT = 300;
var spImg: Sprite;
var urlss = null;
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
    var img = document.getElementById('imghead');
    img!.onload = function () {

        // let UITransform = spImg.getComponent(UITransformComponent);
        // if(UITransform){
        //     UITransform.width = 256;
        //     UITransform.height = 256;
        // }

        //var spriteFrame=spImg.getComponent('cc.Sprite').spriteFrame;
        let texture = new Texture2D();
        let imageAsset = new ImageAsset(img as HTMLImageElement);
        texture.image = imageAsset;

        let tempSpriteFrame = new SpriteFrame();
        tempSpriteFrame.texture = texture;
        // tempSpriteFrame.rect = new Rect(341, 546, 256, 256);

        spImg.spriteFrame = tempSpriteFrame;



        // spImg.spriteFrame = tempSpriteFrame;

        /*var texture=spriteFrame.getTexture();
        texture.initWithElement(this);
        texture.handleLoadedTexture();*/

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




import { _decorator, Component, Node, Sprite, SpriteFrame, Texture2D, ImageAsset, UITransformComponent, Vec2, Rect } from 'cc';
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

    start() {
        // [3]
    }

    onLoad() {
        spImg = this.img;
        // let spriteFrame = new SpriteFrame();
        // spriteFrame.texture = spImg.spriteFrame.texture;

        // this.img.spriteFrame = spriteFrame;
        // var n = 0;
        // n++;

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
