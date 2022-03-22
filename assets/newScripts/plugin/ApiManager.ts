
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

    public static envIndex = 0;

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
            let message = JSON.parse(respJson.message);
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
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
                callback(false, message);
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
            let message = JSON.parse(respJson.message);
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
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
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
        HttpUtil.post(this.BaseUrl + "/" + head + "/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
            customerListener.dispatch(Constants.GameStatus.SHOW_MASK, false);
            console.log(resp);
            if (isSuccess) {
                switch (head) {
                    case "ZJ":
                        callback(true, "2元燃油优惠券");
                        break;
                    case "BJ":
                        callback(true, resp.message);
                        break;
                }

            } else {
                customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
            }

        });

    }

}
