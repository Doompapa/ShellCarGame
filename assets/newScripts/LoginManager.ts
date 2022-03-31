
import { _decorator, Component, Node, EditBoxComponent, ButtonComponent, LabelComponent } from 'cc';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
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

    @property({
        type: Node
    })
    GoRegisterNode!: Node

    @property({
        type: LabelComponent
    })
    TipLabel!: LabelComponent

    private totalTime = 60;

    start() {

        let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);
        switch (area) {
            case "广东省":
                this.GoRegisterNode.active = false;
                this.TipLabel.string = "请进行短信验证";
                break;
        }
    }



    public ClickConfirm() {
        let phone = this.PhoneInput.string;
        let code = this.CodeInput.string;

        //验证手机格式
        if (!this.VerifyPhoneFormat(phone)) {
            return;
        }

        //验证码验证
        if (!this.VerifyCodeFormat(code)) {
            return;
        }

        if (!ApiManager.IsLoginCodeVerify) {
            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "请先获取验证码");
            return;
        }


        ApiManager.VerifyCode(phone, code, (isSuccess) => {

            if (isSuccess) {
                //保存当前手机号
                localStorage.setItem(Constants.GameStatus.PHONE, phone);

                //校验注册
                let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);

                switch (area) {
                    case "浙江省":
                        ApiManager.GetMember("ZJ", phone, (isSuccess, resp) => {
                            if (isSuccess) {
                                ApiManager.IsLogin = true;
                                this.uiControl.ShowReward();
                            } else {
                                this.uiControl.ShowRegister();
                            }
                        });
                        break;
                    case "北京市":
                        ApiManager.GetMember("BJ", phone, (isSuccess, resp) => {
                            if (isSuccess) {
                                ApiManager.IsLogin = true;
                                this.uiControl.ShowReward();
                            } else {
                                this.uiControl.ShowRegister();
                            }
                        });
                        break;
                    case "重庆市":
                        ApiManager.GetMember("CQ", phone, (isSuccess, resp) => {
                            if (isSuccess) {
                                ApiManager.IsLogin = true;
                                this.uiControl.ShowReward();
                            } else {
                                this.uiControl.ShowRegister();
                            }
                        });
                        break;
                    case "广东省":
                        //通过验证后直接抽奖
                        ApiManager.IsLogin = true;
                        this.uiControl.ShowReward();
                        break;
                    default:
                        break;
                }
            }
        });

    }

    public ClickGetCode() {
        //send get code post
        let phone = this.PhoneInput.string;
        if (this.VerifyPhoneFormat(phone)) {
            ApiManager.GetCode(this.PhoneInput.string, (isSuccess) => {

                if (isSuccess) {
                    this.totalTime = 60;
                    this.GetCodeButtonLabel.string = this.totalTime + "s";
                    this.totalTime--;
                    this.schedule(this.ShowCoolDown, 1, 59);
                    this.GetCodeButton.interactable = false;

                    ApiManager.IsLoginCodeVerify = true;
                }

            });
        }
    }

    VerifyPhoneFormat(phone: string) {
        let regPhone = /^1[0-9][0-9]{9}/;
        if (!regPhone.test(phone)) {
            //弹窗提示
            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "请输入正确的手机格式");
            return false;
        }
        return true;
    }

    VerifyCodeFormat(code: string) {
        let regCode = /^[0-9]{6}/;
        if (!regCode.test(code)) {
            //弹窗提示
            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "请输入正确的验证码格式");
            return false;
        }
        return true;
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
