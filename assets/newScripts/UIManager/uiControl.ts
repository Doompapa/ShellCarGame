import { _decorator, Component, Node, LabelComponent, SpriteComponent, find, AnimationComponent, tween, Vec2, Vec3, Tween, RichText, Label, UIOpacityComponent, Sprite, ImageAsset, Texture2D, SpriteFrame, ButtonComponent } from 'cc';
import { MWComboBox } from '../../many-widgets/ComboBox/MW_ComboBox';
import { Car } from '../Car';
import { city } from '../data/city';
import { province } from '../data/province';
import { Constants } from '../Other/constants';
import { customerListener } from '../Other/listener';
import { ApiManager } from '../plugin/ApiManager';
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

    // @property({
    //     type: LabelComponent
    // })
    // GameOverDistance!: LabelComponent  //游戏结束UI

    // @property({
    //     type: RichText
    // })
    // ScoreRank!: RichText  //道具数量

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

    @property({
        type: Node
    })
    LoginUI!: Node

    @property({
        type: Node
    })
    RegisterUI!: Node

    @property({
        type: Node
    })
    RewardUI!: Node


    @property({
        type: Node
    })
    GamePosterUI!: Node

    @property({
        type: Node
    })
    BJRegisterUI!: Node

    @property({
        type: Node
    })
    ToastUI!: Node

    @property({
        type: Node
    })
    FirstUI!: Node

    @property({
        type: LabelComponent
    })
    ToastLabel!: LabelComponent




    private VShellCount = 0;

    public timeCount = 0; //开始计时，每隔15S进行一次关卡替换

    /**
     * 游戏总时长
     */
    private GameTotalTime = 45;

    public runingTime: number = 0;

    private startZ = 0;

    // private boxTween !: Tween<Node>;

    private UIList: Node[] = [];;

    private selectProvince = "北京市";

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
        customerListener.on(Constants.GameStatus.SHOW_MASK, this._showMask, this);
        customerListener.on(Constants.GameStatus.SHOW_TOAST, this.ShowToast, this);


        let car = this.mainCar.getComponent(Car);
        if (car) {
            this.startZ = car.startPos.position.z;
        }

        this.clockTxt.string = (this.GameTotalTime).toString();
        this.countDownLabel != this.CountDownNode.getComponentInChildren(LabelComponent);

        //初始化UI管理数组
        this.UIList.push(this.GameOverParent);
        this.UIList.push(this.CountDownNode);
        this.UIList.push(this.StartTipNode);
        this.UIList.push(this.PhotoSelectUI);
        this.UIList.push(this.ShareUI);
        this.UIList.push(this.TempleSelectUI);
        this.UIList.push(this.InstructionNode);
        this.UIList.push(this.LoginUI);
        this.UIList.push(this.SelectAreaNode);
        this.UIList.push(this.RewardUI);
        this.UIList.push(this.RegisterUI);
        this.UIList.push(this.FirstUI);
        // this.UIList.push(this.GamePosterUI);
        // this.openUI(this.SelectAreaNode);
        this.UIList.push(this.BJRegisterUI);
        this.openUI(this.FirstUI);



        this.ToastUI.active = false;
    }

    /**
     * 打开一个UI节点
     * @param ui 
     */
    private openUI(ui: Node) {
        this.closeAllUI();
        ui.active = true;
    }

    private closeAllUI() {
        for (let i = 0; i < this.UIList.length; i++) {
            this.UIList[i].active = false;
        }
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

        //     this.GameOverDistance.string = this.distanceLabel.string;
        //     this.ScoreRank.string = "<color=#dc150b><outline color=#ffc40f width=6><size=60><b>" + this.VShellCount.toString() + "</b></size></color>";
        }

    }

    /**
     * 展示模板选择界面
     */
    public goToPhotoSelect() {
        this.openUI(this.TempleSelectUI);
    }

    // public goToGamePoster() {
    //     this.openUI(this.GamePosterUI);
    // }

    public templcSelected() {
        this.openUI(this.PhotoSelectUI);
    }

    /**
     * showShareUI
     */
    public hideSelectPhoto() {
        this.openUI(this.ShareUI);
    }

    public confirmArea() {

        localStorage.setItem(Constants.GameStatus.SELECT_AREA, this.selectProvince);

        //todo 进入说明界面前判断

        //广东省 重庆市 北京市 浙江省
        if (this.selectProvince == "广东省" || this.selectProvince == "天津市") {
            this.openUI(this.InstructionNode);
        } else {
            this.openUI(this.LoginUI);
        }
    }

    private OnSelectProvince() {


        for (let i = 0; i < province.length; i++) {
            if (this.provinceComBox.getCurrentText() == province[i].name) {
                let id = province[i].id as string;

                this.selectProvince = province[i].name;

                let cities_data: string[] = [];
                for (let index = 0; index < (city as any)[id].length; index++) {
                    cities_data.push((city as any)[id][index].name);
                }
                this.CityComBox.setItems(cities_data);
                console.log("触发city选择");
            }
        }

    }

    public ShowInstruction() {
        this.openUI(this.InstructionNode);
    }

    /**
     *显示注册页
     */
    public ShowRegister() {
        let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);
        if (area == "北京市") {
            this.openUI(this.BJRegisterUI);
            //     window.location.href = "http://loyalty.bjshell.com.cn/dest/index.html?code=03300fll2btdR84G6Sml2uMPa6100flD&state=12354#/register";
        } else {
            this.openUI(this.RegisterUI);
        }

    }


    public ShowAreaSelect() {
        this.openUI(this.SelectAreaNode);

        let provinces_data: string[] = [];

        for (var i = 0; i < province.length; i++) {
            provinces_data.push(province[i].name);
        }
        this.provinceComBox.setItems(provinces_data);

        customerListener.on(Constants.GameStatus.CLICK_COMBOXITEM, this.OnSelectProvince, this);
        customerListener.dispatch(Constants.GameStatus.CLICK_COMBOXITEM, "北京市");
    }


    public ShowReward() {

        if (ApiManager.IsLogin) {
            this.openUI(this.RewardUI);
        } else {
            this.openUI(this.LoginUI);
        }
        customerListener.dispatch(Constants.GameStatus.HIDE_SHARE);

    }


    public ShowToast(text: string) {
        this.unschedule(this._hideToastFuc);
        this.ToastLabel.string = text;
        this.ToastUI.active = true;
        this.schedule(this._hideToastFuc, 2);
    }

    _hideToastFuc() {
        this.ToastUI.active = false;
    }

}
