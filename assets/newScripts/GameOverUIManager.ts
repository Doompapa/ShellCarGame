
import { _decorator, Component, Node, LabelComponent, RichTextComponent } from 'cc';
import { Car } from './Car';
const { ccclass, property } = _decorator;


@ccclass('GameOverUIManager')
export class GameOverUIManager extends Component {
    @property({
        type: RichTextComponent
    })
    title!: RichTextComponent

    @property({
        type: LabelComponent
    })
    content!: LabelComponent

    @property({
        type: Car
    })
    mainCar!: Car    //获取赛车

    start() {
        // [3]

        // <color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>智慧型车手</b></size></color>
        console.log(this.mainCar._vshellNumber);
        console.log(this.mainCar._knockNumber);
        var distance = Math.floor(this.mainCar.node.getWorldPosition().z - 50);

        if (this.mainCar._vshellNumber >= 30) {
            this.title.string = "<color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>智慧型车手</b></size></color>";
            this.content.string = "您很善于利用Buff道具 — 壳牌威澎燃油，为行驶赋能！\n 壳牌V-Power威澎能效燃油\n主动清洁引擎，防止积碳产生 \n 有效减少爆震，提升引擎动力表现 \n 壳牌诚邀作为智慧型车手的您，动力集结，澎湃出发！";

        } else {

            if (this.mainCar._knockNumber <= 15) {
                this.title.string = "<color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>操作型车手</b></size></color>";
                this.content.string = "您成功躲避了很多爆震！\n 爆震会损害发动机，影响车辆动力表现\n壳牌V-Power威澎能效燃油，有效帮助爱车减少爆震 \n 还能主动清洁引擎，阻止积碳产生，提升引擎动力表现 \n 壳牌诚邀作为操作型车手的您，动力集结，澎湃出发！";

            } else {
                //6500m
                if (distance >= 7000) {
                    let isFristPlay = localStorage.getItem("isFristPlay");
                    if (!isFristPlay) {
                        this.title.string = "<color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>天赋型车手</b></size></color>";
                        this.content.string = "您首次游戏就取得了高分，天赋异禀！\n 壳牌V-Power威澎能效燃油\n主动清洁引擎，防止积碳产生，同时减少爆震 \n 激发引擎潜能，纵情驾驶 \n 壳牌诚邀作为天赋型车手的您，动力集结，澎湃出发！";
                    } else {
                        this.title.string = "<color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>实力型车手</b></size></color>";
                        this.content.string = "您耐力极好、发挥稳定，在赛道上行驶了超长距离！\n 壳牌V-Power威澎能效燃油主动清洁引擎，并防止积碳产生\n同时有效减少爆震 \n 助您发挥实力，书写纵 “擎” 体验 \n 壳牌诚邀作为实力型车手的您，动力集结，澎湃出发！";
                    }
                } else {

                    this.title.string = "<color=#ffffff><outline color=#F3AE2Cwidth=6><size=50><b>敏捷型车手</b></size></color>";
                    this.content.string = "您的分析准确、判断迅速，操作敏捷！\n 就像壳牌V-Power威澎能效燃油\n 主动清洁并保护发动机 \n 同时有效减少爆震，提升引擎动力表现 \n 壳牌诚邀作为敏捷型车手的您，动力集结，澎湃出发！";

                }

            }
        }



    }
}

