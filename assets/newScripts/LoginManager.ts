
import { _decorator, Component, Node, EditBoxComponent, ButtonComponent, LabelComponent } from 'cc';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;



@ccclass('LoginManager')
export class LoginManager extends Component {
    @property({
        type: EditBoxComponent
    })
    PhoneInput!: EditBoxComponent

    @property({
        type: EditBoxComponent
    })
    CodeInput!: EditBoxComponent

    @property({
        type: LabelComponent
    })
    GetCodeButtonLabel!: LabelComponent

    @property({
        type: ButtonComponent
    })
    GetCodeButton!: ButtonComponent

    @property({
        type: TabControl
    })
    uiControl!: TabControl
    


    private totalTime = 60;

    start() {

    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public ClickConfirm() {

        let regPhone = /^1[3|4|5|6|7|8|9][0-9]{9}/;
        if (!regPhone.test(this.PhoneInput.string)) {
            //弹窗提示
            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST,"请输入正确的手机格式");
            return;
        }
        //保存当前手机号
        this.uiControl.ShowInstruction();
      
    }

    public ClickGetCode() {
        //send get code post
        this.totalTime = 60;
        this.GetCodeButtonLabel.string = this.totalTime + "s";
        this.totalTime--;
        this.schedule(this.ShowCoolDown, 1, 59);
        this.GetCodeButton.interactable = false;
    }

    ShowCoolDown() {
        this.GetCodeButtonLabel.string = ((this.totalTime--) + "s").toString();
        if (this.totalTime <= 0) {
            this.unschedule(this.ShowCoolDown);
            this.GetCodeButtonLabel.string = "获取";
            this.GetCodeButton.interactable = true;
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
