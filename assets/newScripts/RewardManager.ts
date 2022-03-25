
var showNode: Node;
var showImageElement: HTMLImageElement;


import { _decorator, Component, Node, tween, Tween, Vec3, UIOpacityComponent, LabelComponent, SpriteComponent, SpriteFrame, ButtonComponent, Texture2D, resources, UITransform, ImageAsset } from 'cc';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
const { ccclass, property } = _decorator;


@ccclass('RewardManager')
export class RewardManager extends Component {
    @property({
        type: Node
    })
    Box!: Node

    @property({
        type: Node
    })
    ReceiveRewardUI!: Node

    @property({
        type: Node
    })
    EffectsNode!: Node

    @property({
        type: Node
    })
    Ticket!: Node

    @property({
        type: LabelComponent
    })
    TicketLabel!: LabelComponent

    @property({
        type: ButtonComponent
    })
    ConfirmButton!: LabelComponent


    @property({
        type: SpriteComponent
    })
    BoxSprite!: SpriteComponent

    @property({
        type: SpriteFrame
    })
    BoxOpendSprite!: SpriteFrame


    @property({
        type: Node
    })
    QRNode!: Node

    private boxTween !: Tween<Node>;


    start() {
        // [3]
        this.ReceiveRewardUI.active = false;
        this.EffectsNode.active = false;
        this.Ticket.active = false;

        showNode = this.QRNode;


        this.QRNode.active = false;
        //宝箱动画
    }
    /**
     * 打开宝箱
     */
    public OpenBox() {
        this.ConfirmButton.node.active = false;

        let phone = localStorage.getItem(Constants.GameStatus.PHONE);
        let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);
        if (phone && area) {
            switch (area) {
                case "浙江省":
                    this.BoxShake();
                    ApiManager.GetReward("ZJ", phone, (isSuccess, ticketName) => {
                        if (isSuccess) {
                            this.ReceiveReward(ticketName);
                            this.LoadQRImage("ZJ");
                        } else {
                            this.BoxShakeStop();
                        }

                    });
                    break;
                case "北京市":
                    this.BoxShake();
                    ApiManager.GetReward("BJ", phone, (isSuccess, ticketName) => {
                        if (isSuccess) {
                            this.ReceiveReward(ticketName);
                            this.LoadQRImage("BJ");
                        } else {
                            this.BoxShakeStop();
                        }
                    });
                    break;
                case "广东省":
                    this.BoxShake();
                    ApiManager.GetReward("GD", phone, (isSuccess, ticketName) => {
                        if (isSuccess) {
                            this.ReceiveReward(ticketName);
                            this.LoadQRImage("GD");
                        } else {
                            this.BoxShakeStop();
                        }
                    });
                    break;
                default:
                    break;
            }


        } else {

        }
    }


    /**
     * 加载图片
     * @param head 
     */
    private LoadQRImage(head: string) {

        this.QRNode.active = true;

        resources.load<Texture2D>("pic/" + head + "/texture", (err, imageTemple) => {


            this.getBase64ImageByTexture2D(imageTemple, (imageBase64) => {

                let testUI = showNode.getComponent(UITransform);
                if (testUI) {

                    let GameCanvas = document.getElementById('GameDiv') as HTMLElement;


                    let deltaWidth = Number(GameCanvas.style.width.replace("px", "")) / 1080;
                    let deltaHeight = Number(GameCanvas.style.height.replace("px", "")) / 1920;

                    let offsetY = deltaHeight * showNode.position.y;

                    showImageElement = document.createElement("img");
                    // showImageElement.src = "https://www.doompapa.com/test.png";
                    showImageElement.style.position = "absolute";

                    showImageElement.style.width = (deltaWidth * testUI.width).toString() + "px";
                    showImageElement.style.height = (deltaHeight * testUI.height).toString() + "px";

                    showImageElement.style.transform = "translate(0, -" + offsetY + "px)";

                    showImageElement.src = imageBase64;
                    GameCanvas!.appendChild(showImageElement);
                }

            });

        });
    }

    private BoxShake() {
        let offset = 15;
        let time = 0.05;
        this.boxTween = tween(this.Box).repeatForever(
            tween().by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, offset) })
                .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
        ).start();
    }

    private BoxShakeStop() {

        this.boxTween.stop();
        this.Box.eulerAngles = new Vec3(0, 0, 0);
    }

    private ReceiveReward(ticketName: string) {
        this.EffectsNode.active = true;

        //宝箱特效相关
        this.boxTween.stop();
        this.Box.eulerAngles = new Vec3(0, 0, 0);
        this.BoxSprite.spriteFrame = this.BoxOpendSprite;

        let gameOverOpacity = this.ReceiveRewardUI.getComponent(UIOpacityComponent);
        if (gameOverOpacity != null) {
            gameOverOpacity.opacity = 0;
            this.ReceiveRewardUI.active = true;
            tween(gameOverOpacity).by(1.5, { opacity: 255 }).start();
        }

        this.Ticket.worldScale = new Vec3(0, 0, 0);
        this.Ticket.active = true;
        tween(this.Ticket).by(1.5, { worldScale: new Vec3(1, 1, 1) }).start();
        this.TicketLabel.string = ticketName;
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



