import { _decorator, Component, Node, BoxColliderComponent, Vec3, loader, Prefab, instantiate, find, random } from 'cc';
import { Car } from './Car';
import { EnvItemControl } from './Env/EnvItemControl';
import { Constants } from './Other/constants';
const { ccclass, property } = _decorator;

@ccclass('ItemsMananger')
export class ItemsMananger extends Component {

    public Instance!: ItemsMananger;

    @property({
        type: Node
    })
    private carNode!: Node;


    @property({
        type: Node
    })
    private envNode!: Node;


    /**
     * 环境预制体
     */
    @property({
        type: Prefab
    })
    envPrefab!: Prefab;



    private envItems: Node[] = [];
    private _prevPos: Vec3 = new Vec3();
    private roadCount = 0;


    onLoad() {
        this.Instance = this;
        this.InitEnv();
    }

    update(dt: number) {
        this.CheckCar();
    }

    private InitEnv() {
        //初始化位置
        this._prevPos.set(this.carNode.worldPosition);

        //初始化环境
        for (let i = 1; i < 11; i++) {
            let envItem = instantiate(this.envPrefab);
            envItem.parent = this.envNode;
            envItem.position = new Vec3(0, 0, 100 * i);
            this.envItems.push(envItem);
        }
    }

    private CheckCar() {
        let distance = Math.abs(Math.abs(this.carNode.worldPosition.z) - Math.abs(this._prevPos.z));
        //拼接路
        if (distance > 100) {
            if (this.roadCount == 0) {
                if (distance >= 200) {
                    this.roadCount++;
                }
            } else {
                this._prevPos.set(this.carNode.worldPosition);
                let newPos: Vec3 = new Vec3(0, 0, this.roadCount * 100 + 1000);
                let first = this.envItems[0];
                this.envItems.splice(0, 1);
                first.position = newPos;
                first.getComponent(EnvItemControl)?.updateRandom();
                this.envItems.push(first);
                this.roadCount++;
            }
        }

    }

    public AppendRoad() {

        console.log('AppendRoad')
    }


    private initColliderObjects(obj: Node, group: number, mask: number) {
        const collider = obj.getComponent(BoxColliderComponent);
        if (collider) {
            collider.setGroup(group);
            collider.setMask(mask);
        }
        //console.log(collider);
    }


    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}

