
import { _decorator, Component, Node } from 'cc';
import { Constants } from '../Other/constants';
import { HttpUtil } from '../Other/HttpUtil';
import { customerListener } from '../Other/listener';
const { ccclass, property } = _decorator;

declare var param: any;
export class ApiManager {

    //https://www.doompapa.com
    // public static BaseUrl = "http://localhost:8080";
    public static BaseUrl = "https://www.doompapa.com";

    public static IsLogin = false;

    /**
     * 验证码是否验证过了
     */
    public static IsLoginCodeVerify = false;

    public static envIndex = 0;

    public static resultType = "天赋";

    /**
     * 会员验证
     * @param head 请求前缀 
     * @param phone 手机号码
     * @param callback  回调
     */
    public static GetMember(head: string, phone: string, callback: (arg0: boolean, arg1: object) => void) {

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);

        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/" + head + "/GetMember", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);

            let respJson = resp as any;
            // let message = JSON.parse(respJson.message);
            // let message = JSON.parse(respJson.message);
            //响应是否成功
            if (isSuccess) {
                console.log(respJson.message);
                //数据是否正常
                if (respJson.code == "200") {
                    callback(true, respJson.message);
                } else {
                    callback(false, respJson.message);
                    customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "当前手机号未注册");
                }
            } else {
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, respJson.message);
                callback(false, respJson.message);
            }
        });
    }

    public static RegisterMember(head: string, phone: string, callback: (arg0: boolean, arg1: object) => void) {

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/" + head + "/RegisterMember", paramStr, (isSuccess, resp) => {

            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            let respJson = resp as any;
            let message = respJson.message;
            //响应是否成功
            if (isSuccess) {
                console.log(message);
                //数据是否正常
                if (respJson.code == "200") {
                    callback(true, message);
                } else {
                    callback(false, message);
                }
            } else {
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, message);
                callback(false, message);
            }
        });
    }

    /**
     * 抽奖
     * @param head 请求前缀
     * @param phone 手机号码
     * @param callback 回调
     */
    public static GetReward(head: string, phone: string, callback: (arg0: boolean, arg1: string) => void) {

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        //http://localhost:8080
        // HttpUtil.post("http://localhost:8080/" + head + "/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
        HttpUtil.post(this.BaseUrl + "/" + head + "/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            console.log(resp);
            if (isSuccess) {
                callback(true, (resp as any).message);
            } else {
                callback(false, (resp as any).message);
                // customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
            }

        });

    }

    /**
 * 四合一抽奖区分地区抽奖
 * @param head 请求前缀
 * @param phone 手机号码
 * @param callback 回调
 */
    public static GetRewardFIO(head: string, phone: string, area: string, callback: (arg0: boolean, arg1: string) => void) {

        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        let param = {
            "phone": phone,
            "area": area
        };

        let paramStr = JSON.stringify(param);
        //http://localhost:8080
        // HttpUtil.post("http://localhost:8080/" + head + "/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
        HttpUtil.post(this.BaseUrl + "/FIO/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            console.log(resp);
            if (isSuccess) {
                callback(true, (resp as any).message);
            } else {
                callback(false, (resp as any).message);
                // customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
            }

        });

    }

    /**
     * 获取验证码
     * @param phone 
     */
    public static GetCode(phone: string, callback: (arg0: boolean) => void) {
        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/SMS", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            console.log(resp);
            callback(isSuccess);
            customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, (resp as any).message);
        });
    }

    /**
 * 验证验证码
 * @param phone 
 */
    public static VerifyCode(phone: string, code: string, callback: (arg0: boolean) => void) {
        customerListener.dispatch(Constants.GameStatus.SHOW_MASK, true);
        let param = {
            "phone": phone,
            "code": code
        };
        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/VerifySMS", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            console.log(resp);
            callback(isSuccess);
            if (!isSuccess) {
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, (resp as any).message);
            }
        });
    }


}
