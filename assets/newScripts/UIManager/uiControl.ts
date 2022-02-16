import { _decorator, Component, Node, LabelComponent, SpriteComponent, find, AnimationComponent, tween, Vec2, Vec3, Tween, RichText } from 'cc';
import { Car } from '../Car';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
import { ResourceManager } from '../ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('TabControl')
export class TabControl extends Component {

    @property({
        type: LabelComponent
    })
    distanceLabel!: LabelComponent;


    @property({
        type: Node
    })
    clock!: Node

    @property({
        type: Node
    })
    mainCar!: Node    //获取赛车


    @property({
        type: LabelComponent
    })
    clockTxt!: LabelComponent  //秒表数字


    @property({
        type: LabelComponent
    })
    VShellTxt!: LabelComponent  //增益道具拾取


    @property({
        type: Node
    })
    GameOverParent!: Node  //游戏结束UI父节点

    @property({
        type: LabelComponent
    })
    GameOverDistance!: LabelComponent  //游戏结束UI

    @property({
        type: LabelComponent
    })
    VShellLabel!: LabelComponent  //道具数量

    @property({
        type: Node
    })
    Box!: Node  //宝箱

    @property({
        type: Node
    })
    BoxRed!: Node  //宝箱红点

    @property({
        type: RichText
    })
    ScoreRank!: RichText  //道具数量

    @property({
        type: Node
    })
    InstructionNode!: Node

    @property({
        type: Node
    })
    StartTipNode!: Node


    private VShellCount = 0;

    public timeCount = 0; //开始计时，每隔15S进行一次关卡替换
    private GameTotalTime = 45;

    public runingTime: number = 0;

    private startZ = 0;

    private boxTween !: Tween<Node>;


    update() {
        this._posTem();
    }

    start() {
        // Your initialization goes here.

        customerListener.on(Constants.GameStatus.GET_VSHELL, this._getVShell, this)
        customerListener.on(Constants.GameStatus.GAME_CLOCK, () => {
            this.clock.active = true;
            this.schedule(this._startSche, 1);
            this.schedule(this._updateRuning, 0.1);
        }, this)
        customerListener.on(Constants.GameStatus.GAME_OVER, this._gameOverEvent, this);
        customerListener.on(Constants.GameStatus.OPEN_BOX, this._openBox, this);
        let car = this.mainCar.getComponent(Car);
        if (car) {
            this.startZ = car.startPos.position.z;
        }

        this.clockTxt.string = (this.GameTotalTime).toString();

        this.GameOverParent.active = false;

        this._checkIsFristPlay();

    }

    /**
     * 检查是否需要展示引导界面
     */
    private _checkIsFristPlay() {
        let isFristPlay = localStorage.getItem("isFristPlay");

        if (isFristPlay) {
            this.StartTipNode.active = true;
            this.InstructionNode.active = false;
        } else {
            this.StartTipNode.active = false;
            this.InstructionNode.active = true;
        }
    }

    private _getVShell(count: number) {
        this.VShellCount = count;
        this.VShellTxt.string = "x" + this.VShellCount.toString();
    }

    private _updateRuning() {
        this.runingTime += 0.1;
    }
    private _posTem() {  //计算赛车位距离
        const _posZ = this.mainCar.getWorldPosition().z;
        const temp = _posZ - this.startZ;
        this.distanceLabel.string = Math.floor(temp).toString() + "m";
    }


    ///开始计时  秒间隔
    private _startSche() {
        //刷新计时
        this.timeCount++;
        this.clockTxt.string = (this.GameTotalTime - this.timeCount).toString();
        if (this.GameTotalTime - this.timeCount <= 0) {
            this.unschedule(this._startSche);
            this.clockTxt.string = "0";
            customerListener.dispatch(Constants.GameStatus.GAME_OVER);
        }
    }
    private _gameOverEvent() {   //判断终点的游戏结束响应事件

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
                .delay(2)
        ).start();


        this.GameOverDistance.string = this.distanceLabel.string;
        this.VShellLabel.string = "您获得了" + this.VShellCount.toString() + "个";
        this.ScoreRank.string = "<color=#dc150b><outline color=#ffc40f width=6><size=70><b>" + 88 + "%</b></size></color>";

        this.GameOverParent.active = true;

    }

    /**
     * 打开宝箱
     */
    private _openBox() {
        this.boxTween.stop();
        this.BoxRed.active = false;
    }

}
