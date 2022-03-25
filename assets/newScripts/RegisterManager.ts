
import { _decorator, Component, Node, EditBoxComponent, LabelComponent, ButtonComponent, WebView } from 'cc';
import { Constants } from './Other/constants';
import { customerListener } from './Other/listener';
import { ApiManager } from './plugin/ApiManager';
import { TabControl } from './UIManager/uiControl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RegisterManager
 * DateTime = Wed Mar 23 2022 03:25:59 GMT+0800 (中国标准时间)
 * Author = sdosatan915
 * FileBasename = RegisterManager.ts
 * FileBasenameNoExtension = RegisterManager
 * URL = db://assets/newScripts/RegisterManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('RegisterManager')
export class RegisterManager extends Component {
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
        // [3]

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
            //保存当前手机号
            localStorage.setItem(Constants.GameStatus.PHONE, phone);

            //校验注册
            let area = localStorage.getItem(Constants.GameStatus.SELECT_AREA);

            switch (area) {
                case "浙江省":
                    ApiManager.RegisterMember("ZJ", phone, (isSuccess, resp) => {
                        if (isSuccess) {
                            ApiManager.IsLogin = true;
                            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "注册成功");
                            this.uiControl.ShowInstruction();
                        } else {
                            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "注册失败,请稍后再试");
                        }
                    });
                    break;
                // case "北京市":
                //     ApiManager.GetMember("BJ", phone, (isSuccess, resp) => {
                //         if (isSuccess) {
                //             ApiManager.IsLogin = true;
                //             this.uiControl.ShowInstruction();
                //             // ApiManager.IsLogin = true;
                //             // this.uiControl.ShowReward();
                //         } else {
                //             customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "当前手机号未注册");
                //         }
                //     });
                //     break;
                // case "重庆市":
                //     ApiManager.GetMember("CQ", phone, (isSuccess, resp) => {
                //         if (isSuccess) {

                //             ApiManager.IsLogin = true;
                //             this.uiControl.ShowReward();
                //         } else {
                //             customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "当前手机号未注册");
                //         }
                //     });
                //     break;
                // case "广东省":
                //     ApiManager.GetMember("GD", phone, (isSuccess, resp) => {
                //         if (isSuccess) {

                //             ApiManager.IsLogin = true;
                //             this.uiControl.ShowReward();
                //         } else {
                //             customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "当前手机号未注册");
                //         }
                //     });
                //     break;
                default:
                    break;
            }
        });
    }

    /**
     * 查看协议一
     */
    public ClickShowText1() {
        // this.webView.url = "https://wechat.zjshell.com/dest/index.html?code=051Bjp000A5DxN1wvr300unvWc1Bjp0O&state=12354#/personcenter/memberAgreement";
        // this.webView.node.active = true;
    }

    /**
    * 查看协议二
    */
    public ClickShowText2() {

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
