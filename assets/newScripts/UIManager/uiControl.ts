import { _decorator, Component, Node, LabelComponent, SpriteComponent, find, AnimationComponent } from 'cc';
import { Car } from '../Car';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
import { ResourceManager } from '../ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('TabControl')
export class TabControl extends Component {


    // @property({
    //     type: [LabelComponent],
    // })
    // progress: LabelComponent[] = [];

    @property({
        type: LabelComponent
    })
    distanceLabel!: LabelComponent;

    @property({
        type: Node
    })
    coinTip!: Node;


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
        type: LabelComponent
    })
    GameOverLabel!: LabelComponent  //游戏结束UI

    public countArr = [0, 0, 0]

    public timeCount = 0; //开始计时，每隔15S进行一次关卡替换
    private GameTotalTime = 45;


    private totalTime: number = 0;

    public runingTime: number = 0;

    private startZ = 0;


    update() {
        this._posTem();
    }

    start() {
        // Your initialization goes here.
        let resource = find("Resource");
        if (resource) {
            let resourceManager = resource.getComponent(ResourceManager);
            if (resourceManager) {
                this.totalTime = resourceManager.totalTime;
            }
        }

        customerListener.on(Constants.GameStatus.GET_COIN, this._addProgressCount, this)
        customerListener.on(Constants.GameStatus.GET_VSHELL, this._getVShell, this)
        customerListener.on(Constants.GameStatus.GAME_CLOCK, () => {
            this.clock.active = true;
            this.schedule(this._startSche, 1);
            this.schedule(this._updateRuning, 0.1);
        }, this)
        customerListener.on(Constants.GameStatus.GAME_OVER, this._gameOverEvent, this);

        let car = this.mainCar.getComponent(Car);
        if (car) {
            this.startZ = car.startPos.position.z;
        }

        this.clockTxt.string = (this.GameTotalTime).toString();

        // this._clock = this.clock.getComponent(SpriteComponent)
        // this._progress2Node = find('Canvas/GameUI/centerUI/tab/progress2').getComponent(SpriteComponent);
        // this._progress3Node = find('Canvas/GameUI/centerUI/tab/progress3').getComponent(SpriteComponent);
        // this._coinTipTxt = this.coinTip.getComponent(LabelComponent)
    }

    private _getVShell(count: number) {
        this.VShellTxt.string = "x" + count.toString();
    }

    private _updateRuning() {
        this.runingTime += 0.1;
    }
    private _posTem() {  //计算赛车位距离
        const _posZ = this.mainCar.getWorldPosition().z;
        const temp = _posZ - this.startZ;
        this.distanceLabel.string = Math.floor(temp).toString() + "m";
    }

    private _addProgressCount(count: number) {   //加分数


        // console.log('这里加分数', this._level)
        // if (this._level == 2) {  //第二关
        //     this.countArr[1] += count;
        //     this.progress[1].string = this.countArr[1].toString()
        //     // console.log(this.progress[1].,'字体颜色')
        //     // this.progress[1].color = new cc.color(255, 255, 255, 255);
        //     // this._progress2Node.color = new cc.color(255, 255, 255, 255);


        // } else if (this._level == 3) {  //第三关
        //     this.countArr[2] += count;
        //     this.progress[2].string = this.countArr[2].toString()

        //     // this.progress[2].color = new cc.color(255, 255, 255, 255);
        //     // this._progress3Node.color = new cc.color(255, 255, 255, 255);

        // } else {    //第一关
        //     this.countArr[0] += count;
        //     this.progress[0].string = this.countArr[0].toString()
        // }

        // this.coinTip.active = true
        // // this._coinTipTxt.string = `+${count}` 
        // const ani = this.coinTip.getComponent(AnimationComponent)
        // // ani.play('coinAnim')    //播放加分数提示动画

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

        // this.runingTime = this.timeCount;
    }
    private _gameOverEvent() {   //判断终点的游戏结束响应事件
        this.GameOverLabel.string = "恭喜完成挑战！" + "\n" + this.distanceLabel.string;



        //将分数存入localStorage
        // this.NextBtn.active = true

        // this._clock.fillRange = 0
        // this.clock.active = false
        // this.radioTxt.node.active = true;
        // this.radioTxt.string = '0';

        // this.unschedule(this._startSche)
        // this.unschedule(this._updateRuning)    //取消定时器
        // localStorage.setItem('liftPoint', JSON.stringify(this.countArr[0]))
        // localStorage.setItem('smoothPoint', JSON.stringify(this.countArr[1]))
        // localStorage.setItem('replenishPoint', JSON.stringify(this.countArr[2]))

    }
    private checkCoinState() {
        // if (this.timeCount == this.doorTwoTime) {
        //     const icons: IconController[] = find("ItemsManager").getComponentsInChildren(IconController);
        //     icons.forEach(element => {
        //         element.showIcon("smooth");
        //     });
        // }

        // if (this.timeCount == this.doorThreeTime) {
        //     const icons: IconController[] = find("ItemsManager").getComponentsInChildren(IconController);
        //     icons.forEach(element => {
        //         element.showIcon("replenish");
        //     });
        // }
    }

}
