var showImageElement: HTMLImageElement;
import { _decorator, Component, Node, Texture2D, resources } from 'cc';
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
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    // @property({
    //     type: Node
    // })
    // Ticket!: Node

    start() {
        resources.load<Texture2D>("pic/BJTest/texture", (err, imageTemple) => {


            this.getBase64ImageByTexture2D(imageTemple, (imageBase64) => {



                let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


                let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
                // let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

                showImageElement = document.createElement("img");
                showImageElement.style.position = "absolute";

                showImageElement.style.width = (deltaWidth * 800).toString() + "px";
                showImageElement.style.height = (deltaWidth * 800).toString() + "px";

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


