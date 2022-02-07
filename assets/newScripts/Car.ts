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
    game
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


    @property({
        displayOrder: 1
    })
    public speed = 0.8;

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
        type: Prefab
    })
    envPrefab!: Prefab;

    private _cameraPos = new Vec3();   //相机初始位置

    private _cameraRotate = new Vec3(); //固定相机旋转


    private _startPos = new Vec3();
    private _endPos = new Vec3();
    private _offsetPos = new Vec3();

    private _addSpeed = 0.001;

    public _maxSpeed = 2;

    private temVec = new Vec3()

    private _moveType = "";   //左、右、中间移动方式，默认为空

    private _rotateY = new Vec3();  //赛车车身旋转角度

    private _targetPostion = new Vec3();

    private x = 0;


    private shakeX = 0;
    private shakeY = 0;


    private rotateSpeed = 0.5;

    public score: number = 0;

    private _isRuning = false;  //是否游戏开始
    private _isShutCamera: boolean = false;  //是否固定住摄像机

    private distanceCount = new Vec3();
    private roadCount = 1;


    private envItems: Node[] = [];
    @property({
        type: ResourceManager
    })
    resourceManager!: ResourceManager;


    private _isMove = true

    private _isTurning = false;

    update(dt: number) {
        if (this._isRuning && this._isMove) {

            this.speed += this._addSpeed;
            if (this.speed > this._maxSpeed) {
                this.speed = this._maxSpeed
            }

            //运动中不移动

            this._setMoveType(dt)

            this._running(dt);
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
        this.setNode(this.startPos)
        this._cameraPos = this.camera.worldPosition;
        this._cameraRotate = this.camera.eulerAngles;
        customerListener.on(Constants.GameStatus.GAME_START, this.GameStart, this)
        // customerListener.on(Constants.GameStatus.GAME_OVER, this.GameOver, this)

        this.distanceCount.set(this.startPos.worldPosition);

        this.smoke.node.active = false;
    }

    public GameStart() {
        this._isRuning = true
    }

    public GameOver() {
        this._isRuning = false
        // this._isShutCamera = true
        //游戏结束时将摄像机固定住，赛车继续往前跑远
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
        // this._isMove = false;


        const otherCollider = event.otherCollider;
        console.log(event, otherCollider.node.name, '发生碰撞')
        if (otherCollider.node.name == 'Knock') {    //普通金币
            console.log(otherCollider.node.name, 'Knock')
            customerListener.dispatch(Constants.GameStatus.GET_COIN, 10)
            // const otherRigid = otherCollider.node.getComponent(RigidBodyComponent);
            this.resourceManager.playCoinSound();
            // anim.play();
            // otherRigid.applyForce(new Vec3(0, 0, 5000 * this.speed));
            // this.scheduleOnce(() => {
            //     this.destroyCoin(otherCollider.node);
            // }, 0.2);
            this.speed = this.minSpeed;
            otherCollider.node.destroy();
            this.playShake();
        } else if (otherCollider.node.name == 'VShell') {
            console.log(otherCollider.node.name, 'VShell')

            customerListener.dispatch(Constants.GameStatus.GET_COIN, 20)
            this.resourceManager.playCoinSound();
            this.scheduleOnce(() => {
                this.destroyCoin(otherCollider.node);
            }, 0.2);
            this._maxSpeed += 0.5;
            otherCollider.node.destroy();
        } else if (otherCollider.node.name == 'Crack') {
            console.log(otherCollider.node.name, '碰到了裂隙')
            this.speed = this.minSpeed;
        }
    }

    private playShake() {
        this.smoke.node.active = true;
        this.smoke.play();
        this.scheduleOnce(() => {
            this.smoke.node.active = false;
        }, 1.5);

        let offset = 0.1;
        tween(this.node)
            .by(0.018, { position: new Vec3(+offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(-offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(+offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(-offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(+offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(-offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(+offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .by(0.018, { position: new Vec3(-offset, 0, this.speed * 0.018 * 100) }, { easing: 'sineOutIn' })
            .call(() => {
                // let z = this.node.position.z;
                // this.node.position = new Vec3(x, y, z);
            }).start();

        //位置是在当前位置增加
        // tween(this.node)
        //     .by(1, { position: new Vec3(0, 0, 0) }, { easing: 'quintOut' }).call(() => {
        //         this._isMove = true;
        //     })
        //     .start()


        // cc.runAction(action);
        // setTimeout(() => {
        //     cc.stopAction(action);
        //     this.node.position = new Vec3(x, y, z);
        // }, 1000);


        // tween(this.node).to(1, { scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5) }).call(() => {
        //     console.log('This is a callback');
        // }).by(1, { scale: new Vec3(-1, -1, -1) }, { easing: 'sineOutIn' }
        // ).start();


    }


    private destroyCoin(whichNode: Node) {
        if (whichNode) {
            whichNode.destroy();
        }
    }

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

    private _setMoveType(dt: number) {    //赛车左滑右滑
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

    private _running(dt: number) { //赛车移动

        // console.log('移动>>>>>>>')
        this._offsetPos.set(this.node.worldPosition);
        const z = this._endPos.z - this._offsetPos.z

        if (z !== 0) {
            if (z > 0) {
                this._offsetPos.z += this.speed * dt * 100;
                if (this._offsetPos.z > this._endPos.z) {
                    this._offsetPos.z = this._endPos.z
                }
            }
        }
        // console.log(this._offsetPos,this.speed,'设置坐标点')
        this.node.setWorldPosition(this._offsetPos)


        //拼接路
        if (Math.abs(Math.abs(this.node.worldPosition.z) - Math.abs(this.distanceCount.z)) > 200) {
            // console.log('超过180');
            this.distanceCount.set(this.node.worldPosition);
            this.roadCount += 1;
            this.AppendRoad();
        }


        Vec3.subtract(this.temVec, this._endPos, this._offsetPos) //判断起点 -- 终点的距离

        if (this.temVec.length() <= 0.01) {

            this._isMove = false    //到终点了
            customerListener.dispatch(Constants.GameStatus.GAME_OVER)   //游戏结束
        }

    }


    private AppendRoad() {
        const newPos: Vec3 = new Vec3(this.roadGroup.worldPosition.x, this.roadGroup.worldPosition.y, this.roadCount * 200 + 500);

        if (this.envItems.length > 3) {

            let first = this.envItems[0];
            this.envItems.splice(0, 1);
            first.position = newPos;
            console.log(first);
            first.getComponent(EnvItemControl)?.updateRandom();
            this.envItems.push(first);

        } else {
            let fab = instantiate(this.envPrefab);
            fab.position = newPos;
            fab.parent = this.roadGroup;
            this.envItems.push(fab);
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


}
