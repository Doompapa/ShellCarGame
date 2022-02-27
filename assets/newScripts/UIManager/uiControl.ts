import { _decorator, Component, Node, LabelComponent, SpriteComponent, find, AnimationComponent, tween, Vec2, Vec3, Tween, RichText, Label, UIOpacityComponent, Sprite, ImageAsset, Texture2D, SpriteFrame, ButtonComponent } from 'cc';
import { MWComboBox } from '../../many-widgets/ComboBox/MW_ComboBox';
import { Car } from '../Car';
import { city } from '../data/city';
import { province } from '../data/province';
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
    SelectAreaNode!: Node

    @property({
        type: MWComboBox
    })
    provinceComBox!: MWComboBox

    @property({
        type: MWComboBox
    })
    CityComBox!: MWComboBox

    @property({
        type: Node
    })
    StartTipNode!: Node


    @property({
        type: Node
    })
    CountDownNode!: Node

    @property({
        type: LabelComponent
    })
    countDownLabel!: LabelComponent

    @property({
        type: ResourceManager
    })
    resourceManager!: ResourceManager;

    @property({
        type: Node
    })
    PhotoSelectUI!: Node

    @property({
        type: Node
    })
    Mask!: Node

    @property({
        type: Node
    })
    ShareUI!: Node

    
    @property({
        type: Node
    })
    TempleSelectUI!: Node


    private VShellCount = 0;

    public timeCount = 0; //开始计时，每隔15S进行一次关卡替换

    /**
     * 游戏总时长
     */
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
        customerListener.on(Constants.GameStatus.SHOW_MASK, this._showMask, this);


        let car = this.mainCar.getComponent(Car);
        if (car) {
            this.startZ = car.startPos.position.z;
        }

        this.clockTxt.string = (this.GameTotalTime).toString();
        this.countDownLabel != this.CountDownNode.getComponentInChildren(LabelComponent);

        this.GameOverParent.active = false;
        this.CountDownNode.active = false;
        this.StartTipNode.active = false;
        this.PhotoSelectUI.active = false;
        this.Mask.active = false;
        this.ShareUI.active = false;
        this.TempleSelectUI.active = false;
        this.InstructionNode.active = false;

        this.SelectAreaNode.active = true;

        let provinces_data: string[] = [];

        for (var i = 0; i < province.length; i++) {
            provinces_data.push(province[i].name);
        }
        this.provinceComBox.setItems(provinces_data);
        this.CityComBox.setItems([]);
        customerListener.on(Constants.GameStatus.CLICK_COMBOXITEM, this.OnSelectProvince, this);

        // this.InstructionNode.active = true;

    }

    private _showMask(isShow: boolean) {
        this.Mask.active = isShow;
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


        if (this.GameTotalTime - this.timeCount <= 5) {
            let time = (this.GameTotalTime - this.timeCount).toString();
            this.CountDownNode.active = true;
            this.countDownLabel.string = time;
            this.resourceManager.playerTimer();
        }

        if (this.GameTotalTime - this.timeCount <= 0) {
            this.unschedule(this._startSche);
            this.clockTxt.string = "0";
            this.CountDownNode.active = false;
            customerListener.dispatch(Constants.GameStatus.GAME_OVER);
        }
    }

    private _gameOverEvent() {   //判断终点的游戏结束响应事件
        this.resourceManager.playGameOver();

        //todo 延迟显示，有过度过程
        let gameOverOpacity = this.GameOverParent.getComponent(UIOpacityComponent);
        if (gameOverOpacity != null) {
            gameOverOpacity.opacity = 0;
            // this.GameOverParent.worldScale = new Vec3(0, 0, 0);
            this.GameOverParent.active = true;
            // tween(gameOverOpacity).by(0.5, { worldScale: new Vec3(1, 1, 1) }).start();
            tween(gameOverOpacity).by(1.5, { opacity: 255 }).start();

            //宝箱动画
            // let offset = 15;
            // let time = 0.05;
            // this.boxTween = tween(this.Box).repeatForever(
            //     tween().by(time, { eulerAngles: new Vec3(0, 0, offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, offset) })
            //         .by(time, { eulerAngles: new Vec3(0, 0, -offset) })
            //         .delay(2)
            // ).start();

            this.GameOverDistance.string = this.distanceLabel.string;
            this.VShellLabel.string = "您获得了" + this.VShellCount.toString() + "个";
            this.ScoreRank.string = "<color=#dc150b><outline color=#ffc40f width=6><size=70><b>" + 88 + "%</b></size></color>";
        }

    }

    /**
     * 展示模板选择界面
     */
    public goToPhotoSelect(){
        // this.PhotoSelectUI.active = true;
        // this.GameOverParent.active = false;

        this.PhotoSelectUI.active = false;
        this.GameOverParent.active = false;

        this.TempleSelectUI.active = true;
    }

    public templcSelected(){

        this.GameOverParent.active = false;
        this.TempleSelectUI.active = false;

        this.PhotoSelectUI.active = true;
    }

    /**
     * showShareUI
     */
    public hideSelectPhoto() {
        this.PhotoSelectUI.active = false;
        this.TempleSelectUI.active = false;

        this.ShareUI.active = true;
    }

    /**
     * 打开宝箱
     */
    private _openBox() {
        this.boxTween.stop();
        this.BoxRed.active = false;
    }

    public confirmArea(){
    
        this.SelectAreaNode.active = false;
        this.InstructionNode.active = true;
    }

    private OnSelectProvince() {
        // let id = 110000000000;

        let id = '';

        for (var i = 0; i < province.length; i++) {
            if (this.provinceComBox.getCurrentText() == province[i].name) {
                // id = Number(province[i].id);
                id = province[i].id;
            }
        }

        if (id != '') {
            let cities_data: string[] = [];

            for (var i = 0; i < city[id].length; i++) {
                cities_data.push(city[id][i].name);
            }

            this.CityComBox.setItems(cities_data);
        }


    }


}
