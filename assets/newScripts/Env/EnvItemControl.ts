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

    //广告牌控制
    @property({
        type: Node,
    })
    adBoard1!: Node;

    @property({
        type: Node,
    })
    adBoard2!: Node;


    private itemsMananger!: Node;

    @property({
        type: Prefab,
    })
    VShell!: Prefab

    @property({
        type: Prefab,
    })
    Knock!: Prefab

    /**
     * 是否生成道具
     */
    @property
    public isCreate = true;

    start() {
        let temp = find("ItemsManager");
        if (temp) {
            this.itemsMananger = temp;
        }
        // Your initialization goes here.
        this.updateRandom();
    }

    /**
     * 刷新环境，包括道具
     */
    public updateRandom() {
        // let randomAd = this.random(1, 5);
        // if (randomAd <= 2) {
        //     this.adBoard1.active = false;
        //     this.adBoard2.active = false;
        // } else {
        //     if (randomAd <= 3) {
        //         this.adBoard1.active = true;
        //         this.adBoard2.active = false;
        //     } else {
        //         this.adBoard1.active = false;
        //         this.adBoard2.active = true;
        //     }
        // }

        if (this.isCreate) {
            for (let i = 0; i < 3; i++) {
                let whichOne = this.random(0, 4);
                let fab = null;
                if (whichOne <= 2) {
                    fab = instantiate(this.Knock);
                } else {
                    fab = instantiate(this.VShell);
                }

                //随机车道
                let randomNum = this.random(-1, 2);
                fab.position = new Vec3(10 * randomNum, 0, this.node.position.z + this.random(80, 100) * i);

                fab.parent = find("ItemsManager");
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
                fabTwo.position = new Vec3(10 * randomNUmSecond, 0, this.node.position.z + this.random(80, 100) * i);
                fabTwo.parent = find("ItemsManager");
                fabTwo.eulerAngles = new Vec3(0, 0, 0);
                this.initColliderObjects(fabTwo, Constants.ColliderGroup.NORMALCOIN, Constants.ColliderGroup.CAR);

            }
        }

    }

    private initColliderObjects(obj: Node, group: number, mask: number) {
        const collider = obj.getComponent(BoxColliderComponent);
        if (collider) {
            collider.setGroup(group);
            collider.setMask(mask);
        }
        //console.log(collider);
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
