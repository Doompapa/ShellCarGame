import {
    _decorator,
    Component,
    Node,
    Vec2,
    Vec3,
    BoxColliderComponent,
    loader,
    instantiate,
    Prefab,
    ICollisionEvent,
    AnimationComponent,
    Scheduler,
    RigidBodyComponent,
    find,
    tween,
    Tween,
    ParticleSystemComponent,
    game,
    CameraComponent,
    Camera,
    ProgressBar,
    AudioSource
} from 'cc';
import { Tree } from './Env/Tree';
import { EnvItemControl } from './Env/EnvItemControl';
import { GameCtrl } from './GameCtrl';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ResourceManager } from './ResourceManager';
import { RoadPoints } from './RoadPoints';
import { TabControl } from './UIManager/uiControl';

const { ccclass, property } = _decorator;

@ccclass('Car')
export class Car extends Component {
    @property
    minSpeed = 0.1;

    @property({
        type: Node,
        displayOrder: 2
    })
    startPos!: Node;  //中心开始点

    @property({
        type: Node,
        displayOrder: 3
    })
    leftStartPos!: Node    //左赛道开始点

    @property({
        type: Node,
        displayOrder: 4
    })
    rightStartPos!: Node  //右赛道开始点

    @property({
        type: Node,
        displayOrder: 5
    })
    EndPos!: Node;  //中心开始点

    @property({
        type: Node,
        displayOrder: 6
    })
    leftEndPos!: Node    //左赛道开始点

    @property({
        type: Node,
        displayOrder: 7
    })
    rightEndPos!: Node   //右赛道开始点


    @property({
        type: Node,
        displayOrder: 8
    })
    roadGroup!: Node   //右赛道开始点

    @property({
        type: Node
    })
    camera!: Node; //设置相机

    @property({
        type: ParticleSystemComponent
    })
    smoke!: ParticleSystemComponent; //设置黑烟特效


    @property({
        type: ParticleSystemComponent
    })
    vshellEffet!: ParticleSystemComponent; //设置黑烟特效

    @property({
        type: Prefab
    })
    envPrefab!: Prefab;

    @property({
        type: Node
    })
    statusBarParent!: Node;

    @property({
        type: ProgressBar
    })
    carbonBar!: ProgressBar;

    @property({
        type: ProgressBar
    })
    knockBar!: ProgressBar;



    private _cameraPos = new Vec3();   //相机初始位置

    private _cameraRotate = new Vec3(); //固定相机旋转


    private _startPos = new Vec3();
    private _endPos = new Vec3();
    private _offsetPos = new Vec3();

    //速度相关
    public speed = 0;
    private _addSpeed = 0.005;
    private _maxSpeed = 2;
    /**
     * 吃到道具的前冲速度倍数
     */
    private _dynamicSpeed = 1.5;

    private temVec = new Vec3()

    private _moveType = "";   //左、右、中间移动方式，默认为空

    private _rotateY = new Vec3();  //赛车车身旋转角度

    private _targetPostion = new Vec3();

    private x = 0;

    private rotateSpeed = 0.5;

    public score: number = 0;


    private _isShutCamera: boolean = false;  //是否固定住摄像机

    /**
     * 用于计算阶段行驶距离
     */
    private distanceCalPoint = new Vec3();
    private roadCount = 0;

    private currentCameraComponent!: Camera;

    //爆震值
    private _knock = 0;

    //积碳值
    private _carbon = 0;
    private _carbonSpeed = 5;

    private _carbonReduce = 30;
    private _knockReduce = 30;

    public _vshellNumber = 0;
    public _knockNumber = 0;

    private _isCarbonShakeCoolDown = false;

    /**
     * 抖动中无法操作
     */
    private _isShaking = false;

    private envItems: Node[] = [];
    @property({
        type: ResourceManager
    })
    resourceManager!: ResourceManager;

    private _isRuning = false;  //是否游戏开始
    private _isMove = true

    /**
     * 是否在冲刺中
     */
    private _isSprint = false;

    /**
     * 冲刺时间
     */
    private _sprintTime = 0.2;

    update(dt: number) {

        if (this._isRuning && this._isMove) {

            if (!this._isSprint) {
                this.speed += this._addSpeed * dt * 100;
                if (this.speed > (this._maxSpeed - this._dynamicSpeed * (this._carbon / 100))) {
                    this.speed = this._maxSpeed - this._dynamicSpeed * (this._carbon / 100);
                }
            }
            //运动中不移动
            this._setMoveType(dt)
            this.refreshStatus();
            this._running(dt);
        }

        if (this._isRuning) {
            if (!this._isShutCamera) {
                this.setCamera(true)
            } else {

                console.log('固定摄像机')
                this.setCamera(false)
            }
        }

    }


    start() {
        game.frameRate = 60;
        // game.setFrameRate(60);
        this.setNode(this.startPos)
        this._cameraPos = this.camera.worldPosition;
        this._cameraRotate = this.camera.eulerAngles;
        customerListener.on(Constants.GameStatus.GAME_START, this.GameStart, this)
        customerListener.on(Constants.GameStatus.GAME_OVER, this.GameOver, this)

        this.distanceCalPoint.set(this.startPos.worldPosition);

        // this.smoke.node.active = false;
        // this.vshellEffet.node.active = false;

        this.currentCameraComponent = this.camera.getComponent(CameraComponent)!;

    }

    public GameStart() {
        this._isRuning = true;

    }

    //刷新状态条UI
    refreshStatus(): void {
        if (!this.knockBar) return;
        if (!this.carbonBar) return;

        let _v3_0: Vec3 = new Vec3(0, 0, 0);
        this.statusBarParent.getWorldPosition(_v3_0);

        let nextPos = new Vec3(_v3_0.x, _v3_0.y + 3, _v3_0.z);

        //爆震
        this.currentCameraComponent.convertToUINode(_v3_0, this.knockBar.node.parent!, _v3_0);
        this.knockBar.node.setPosition(_v3_0);
        this.knockBar.progress = this._knock / 100;


        //积碳
        this.currentCameraComponent.convertToUINode(nextPos, this.carbonBar.node.parent!, nextPos);
        this.carbonBar.node.setPosition(nextPos);
        this.carbonBar.progress = this._carbon / 100;


        //积碳效果被触发
        if (!this._isCarbonShakeCoolDown && this._knock >= 50) {
            let num = this.random(0, 101);
            if (num <= this._knock) {
                this.carbonShake();
                this._isCarbonShakeCoolDown = true;
                this.scheduleOnce(() => {
                    this._isCarbonShakeCoolDown = false;
                }, 3);
            }

        }


        if (!this.carbonBar.node.active) {
            this.carbonBar.node.active = true;
        }

        if (!this.knockBar.node.active) {
            this.knockBar.node.active = true;
        }
    }


    //游戏结束
    public GameOver() {

        this._isRuning = false
        // this._isShutCamera = true
        //游戏结束时将摄像机固定住，赛车继续往前跑远
        let audioSource = this.node.getComponent(AudioSource);
        if (audioSource) {
            audioSource.pause();
        }
    }

    private _colliderInit() {    //碰撞初始化
        const selfcollider = this.node.getComponent(BoxColliderComponent);
        if (selfcollider) {
            selfcollider.on('onTriggerEnter', this._TriggerCheck, this);
            selfcollider.setGroup(Constants.ColliderGroup.CAR)
            selfcollider.setMask(Constants.ColliderGroup.ADDCOIN);
            selfcollider.addMask(Constants.ColliderGroup.NORMALCOIN);
        }
    }

    //碰撞检测
    private _TriggerCheck(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        console.log(event, otherCollider.node.name, '发生碰撞')
        if (otherCollider.node.name == 'Knock') {    //普通金币
            console.log(otherCollider.node.name, 'Knock')
            customerListener.dispatch(Constants.GameStatus.GET_KNOCK, 10)
            this.resourceManager.playKnockSound();
            otherCollider.node.destroy();
            this.eatknock();
            this._knockNumber++;
        } else if (otherCollider.node.name == 'VShell') {
            console.log(otherCollider.node.name, 'VShell')
            this._vshellNumber++;
            customerListener.dispatch(Constants.GameStatus.GET_VSHELL, this._vshellNumber)
            this.resourceManager.playCoinSound();
            // this.scheduleOnce(() => {
            //     this.destroyCoin(otherCollider.node);
            // }, 0.2);
            // this._maxSpeed += 0.5;
            this.eatVShell();
            otherCollider.node.destroy();
        }
    }

    private eatknock() {
        this._knock += this._knockReduce;
        if (this._knock > 100) {
            this._knock = 100;
        }
    }

    /**
     * 吃到小油滴道具
     */
    private eatVShell() {
        this.vshellEffet.node.active = true;
        this.vshellEffet.play();

        this._isSprint = true;
        let speedTemp = this.speed;
        this.speed = this._maxSpeed * 1.2;
        this.scheduleOnce(() => {
            this._isSprint = false;
            this.speed += this._addSpeed * this._sprintTime * 100;
            this.speed = speedTemp;
        }, this._sprintTime);

        this._carbon -= this._carbonReduce;
        if (this._carbon < 0) {
            this._carbon = 0;
        }

        this._knock -= this._knockReduce;
        if (this._knock < 0) {
            this._knock = 0;
        }
    }

    /**
     * 爆震累积触发效果
     */
    private carbonShake() {
        this.speed = this.minSpeed;
        this.smoke.node.active = true;
        this.smoke.play();

        let offset = 0.2;
        let time = 0.05;
        this._isShaking = true;
        tween(this.node)
            .by(time, { position: new Vec3(+offset, 0, this.speed * time * 100) }, { easing: 'quadOut' }) //quadOut  sineOutIn
            .by(time, { position: new Vec3(-offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(+offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(-offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(+offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(-offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(+offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .by(time, { position: new Vec3(-offset, 0, this.speed * time * 100) }, { easing: 'quadOut' })
            .call(() => {
                // let z = this.node.position.z;
                // this.node.position = new Vec3(x, y, z);
                this._isShaking = false;
            }).start();
    }

    /**
     * 设置相机跟随
     * @param flag 
     */
    public setCamera(flag = false) { //设置相机位置 //true为实时更新
        if (!flag) {
            this.camera.setWorldPosition(this._cameraPos)
        } else {
            //console.log(this.node.worldPosition.y, this.node.position.z);
            // this.camera.setWorldPosition(this.node.worldPosition.x, this.node.worldPosition.y + 6,
            //     this.node.worldPosition.z - 11.5)

            // y
            this.camera.setWorldPosition(0, this.node.worldPosition.y + 25,
                this.node.worldPosition.z - 50)
        }

    }

    /**
     * 控制赛车左右滑
     * @param dt 
     */
    private _setMoveType(dt: number) {    //赛车左滑右滑

        if (this._isShaking) {
            return;
        }

        this._offsetPos.set(this.node.worldPosition);

        if (this._moveType == 'left') { //左滑
            this._rotateY.set(0, 30, 0)
            //往左边滑
            this._targetPostion = this.leftStartPos.worldPosition;
            this.x = this._targetPostion.x - this._offsetPos.x;

            if (this.x !== 0) {
                this._offsetPos.x += this.rotateSpeed * dt * 100
                //console.log('xxxx', this._offsetPos.x, this._targetPostion.x)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x >= this._targetPostion.x) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = this._targetPostion.x
                }
            }

        } else if (this._moveType == 'right') {

            this._targetPostion = this.rightStartPos.worldPosition;
            this.x = this._targetPostion.x - this._offsetPos.x;
            this._rotateY.set(0, -30, 0)
            // console.log('右滑判断')
            if (this.x !== 0) {
                this._offsetPos.x -= this.rotateSpeed * dt * 100
                // console.log('xxxx', this._offsetPos.x, this._targetPostion.x)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x <= this._targetPostion.x) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = this._targetPostion.x
                }
            }

        } else if (this._moveType == 'center') {
            // console.log('回到中间')
            if (this._offsetPos.x < 0) {  //从右边回到中间位置
                this._offsetPos.x += this.rotateSpeed * dt * 100
                this._rotateY.set(0, 30, 0)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x >= 0) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = 0
                }
            } else {
                //从左边回到中间
                this._offsetPos.x -= this.rotateSpeed * dt * 100
                this._rotateY.set(0, -30, 0)
                this.node.eulerAngles = this._rotateY  //设置左滑右滑角度
                if (this._offsetPos.x <= 0) {
                    this._rotateY.set(0, 0, 0)
                    this.node.eulerAngles = this._rotateY
                    this._offsetPos.x = 0
                }
            }

        }
        this.node.setWorldPosition(this._offsetPos)

    }

    /**
     * 赛车移动
     * @param dt 
     */
    private _running(dt: number) {

        //移动
        this._offsetPos.set(this.node.worldPosition);
        this._offsetPos.z += this.speed * dt * 100;
        this.node.setWorldPosition(this._offsetPos);


        let distance = Math.abs(Math.abs(this.node.worldPosition.z) - Math.abs(this.distanceCalPoint.z));

        //更新积碳值
        if (distance >= 100) {
            this.distanceCalPoint.set(this.node.worldPosition);
            if (this._carbon < 100 - this._carbonSpeed) {
                this._carbon += this._carbonSpeed;
            } else {
                this._carbon = 100;
            }

        }

    }

    public setNode(entry: Node) { //设置起跑点
        console.log('设置起跑点')
        this._startPos = entry.getWorldPosition();
        let roadPoints = entry.getComponent(RoadPoints);
        if (roadPoints) {
            this._endPos = roadPoints.nextStation.worldPosition;
        }
        this.node.setWorldPosition(this._startPos)
        this._colliderInit()
    }

    public setMoveType(type: string) {  //控制移动方式
        this._moveType = type
    }

    // public controlMove(flag = true) {    //控制是否移动


    //     this._isMove = flag

    // }

    /**
     * 随机值
     * @param lower 
     * @param upper 
     * @returns 
     */
    random(lower: number, upper: number) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }

}
