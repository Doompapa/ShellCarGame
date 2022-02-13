import { _decorator, Component, Node, Prefab, find, instantiate, Vec3, BoxColliderComponent } from 'cc';
import { ItemsMananger } from '../ItemsMananger';
import { Constants } from '../Other/constants';
const { ccclass, property } = _decorator;

@ccclass('EnvItemControl')
export class EnvItemControl extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;


    @property({
        type: Prefab,
    })
    leftBuild1!: Prefab;

    @property({
        type: Prefab,
    })
    leftBuild2!: Prefab;

    @property({
        type: Node,
    })
    leftEnvNode!: Node;


    @property({
        type: Node,
    })
    rightEnvNode!: Node;

    @property({
        type: Node,
    })
    farEnvNode!: Node;


    @property({
        type: Prefab,
    })
    VShell!: Prefab

    @property({
        type: Prefab,
    })
    Knock!: Prefab

    private itemsMananger!: Node;

    /**
     * 是否生成道具
     */
    @property
    public isCreate = true;

    onLoad() {

    }

    start() {
        let temp = find("ItemsManager");
        if (temp) {
            this.itemsMananger = temp;
        }
        // Your initialization goes here.
        this.updateRandom();

    }


    public updateEnv() {
        //左边建筑景物
        for (let i = 0; i < this.leftEnvNode.children.length; i++) {
            this.leftEnvNode.children[i].active = false;
        }
        let randomLeft = this.random(0, this.leftEnvNode.children.length + 2);
        if (randomLeft < this.leftEnvNode.children.length) {
            this.leftEnvNode.children[randomLeft].active = true;
        }


        //右边景物
        for (let i = 0; i < this.rightEnvNode.children.length; i++) {
            this.rightEnvNode.children[i].active = false;
        }
        let randomRight = this.random(0, this.rightEnvNode.children.length);
        if (randomRight < this.rightEnvNode.children.length) {
            this.rightEnvNode.children[randomRight].active = true;
        }

        //远处景物
        for (let i = 0; i < this.farEnvNode.children.length; i++) {
            this.farEnvNode.children[i].active = false;
        }
        let randomFar = this.random(0, this.farEnvNode.children.length + 2);
        if (randomFar < this.farEnvNode.children.length) {
            this.farEnvNode.children[randomFar].active = true;
        }


        // let leftItem;
        // if (randomLeft >= 5) {
        //     leftItem = instantiate(this.leftBuild1);
        // } else {
        //     leftItem = instantiate(this.leftBuild2);
        // }
        // leftItem.parent = this.leftEnvNode;
        // leftItem.worldPosition = this.leftEnvNode.worldPosition;
    }

    /**
     * 刷新环境，包括道具
     */
    public updateRandom() {
        this.updateEnv();
        if (this.isCreate) {
            let whichOne = this.random(0, 4);
            let fab = null;
            if (whichOne <= 2) {
                fab = instantiate(this.Knock);
            } else {
                fab = instantiate(this.VShell);
            }

            //随机车道
            let randomNum = this.random(-1, 2);
            fab.position = new Vec3(10 * randomNum, 0, this.node.position.z + this.random(60, 70));

            fab.parent = this.itemsMananger;
            fab.eulerAngles = new Vec3(0, 0, 0);
            this.initColliderObjects(fab, Constants.ColliderGroup.NORMALCOIN, Constants.ColliderGroup.CAR);

            let whichTwo = this.random(0, 4);
            let fabTwo = null;
            if (whichTwo <= 2) {
                fabTwo = instantiate(this.Knock);
            } else {
                fabTwo = instantiate(this.VShell);
            }

            let randomNUmSecond = this.random(-1, 2);
            while (randomNUmSecond == randomNum) {
                randomNUmSecond = this.random(-1, 2);
            }
            fabTwo.position = new Vec3(10 * randomNUmSecond, 0, this.node.position.z + this.random(60, 70));
            fabTwo.parent = this.itemsMananger;
            fabTwo.eulerAngles = new Vec3(0, 0, 0);
            this.initColliderObjects(fabTwo, Constants.ColliderGroup.NORMALCOIN, Constants.ColliderGroup.CAR);
        }

    }

    private initColliderObjects(obj: Node, group: number, mask: number) {
        const collider = obj.getComponent(BoxColliderComponent);
        if (collider) {
            collider.setGroup(group);
            collider.setMask(mask);
        }
    }

    /**
     * 随机整数
     * @param lower 包括 
     * @param upper 不包括
     * @returns 
     */
    random(lower: number, upper: number) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
}
