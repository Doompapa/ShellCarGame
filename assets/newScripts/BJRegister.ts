var showImageElement: HTMLImageElement;
import { _decorator, Component, Node, Texture2D, resources } from 'cc';
import { Constants } from './Other/constants';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = BJRegister
 * DateTime = Mon Mar 28 2022 13:55:18 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = BJRegister.ts
 * FileBasenameNoExtension = BJRegister
 * URL = db://assets/newScripts/BJRegister.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('BJRegister')
export class BJRegister extends Component {

    start() {


    }

    onEnable() {
        if (showImageElement != undefined && showImageElement != null) {
            showImageElement.style.display = "";
        }

        let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);
        switch (area) {
            case "浙江省":
                this.LoadQRImage("ZJ");
                break;
            case "北京市":
                this.LoadQRImage("BJ");
                break;
            case "广东省":
                this.LoadQRImage("GD");
                break;
            case "重庆市":
                this.LoadQRImage("CQ");
                break;
            default:
                this.LoadQRImage("FIO");
                break;
        }

    }

    onDisable() {
        if (showImageElement != undefined && showImageElement != null) {
            showImageElement.style.display = "none";
        }

    }

    /**
    * 加载图片
    * @param head 
    */
    private LoadQRImage(head: string) {

        resources.load<Texture2D>("pic/" + head + "/texture", (err, imageTemple) => {


            this.getBase64ImageByTexture2D(imageTemple, (imageBase64) => {



                let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


                let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
                // let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

                if (showImageElement == null) {
                    showImageElement = document.createElement("img");
                }

                showImageElement.style.position = "absolute";

                showImageElement.style.width = (deltaWidth * 260).toString() + "px";
                showImageElement.style.height = (deltaWidth * 260).toString() + "px";

                // showImageElement.style.transform = "translate(0, -100px)";

                showImageElement.src = imageBase64;
                GameCanvas!.appendChild(showImageElement);
            });
        });
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


