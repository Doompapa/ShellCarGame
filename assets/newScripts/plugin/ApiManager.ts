
import { _decorator, Component, Node } from 'cc';
import { HttpUtil } from '../Other/HttpUtil';
const { ccclass, property } = _decorator;

declare var param: any;
export class ApiManager {

    //https://www.doompapa.com
    // public static BaseUrl = "http://localhost:8080";
    public static BaseUrl = "https://www.doompapa.com";

    public static IsLogin = false;

    public static envIndex = 0;

    public static GetMemberGD(phone: string) {
        // var param: any = {}
        // param = {
        //     'EtpCode': ApiManager.EtpCodeGD,
        //     'Phone': phone,
        // }

        // let signStr = "EtpCode=" + param.EtpCode + "&Phone=" + param.Phone + "&key=" + ApiManager.apiKeyGD;
        // let sign = new MD5().hex_md5(signStr).toUpperCase();
        // param['sign'] = sign;

        // let paramStr = JSON.stringify(param);
        // HttpUtil.post("https://shell-app.objectretail.com:9000/WebApi.ashx?type=TrdMemberMdl&method=GetMemberPointByPhone", paramStr, (isSuccess, resp) => {

        //     console.log(resp);

        // });


    }


    /**
     * 会员验证
     * @param head 请求前缀 
     * @param phone 手机号码
     * @param callback  回调
     */
    public static GetMember(head: string, phone: string, callback: (arg0: boolean, arg1: object) => void) {
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/" + head + "/GetMember", paramStr, (isSuccess, resp) => {
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
    public static GetReward(head: string, phone: string, callback: (arg0: string) => void) {
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/" + head + "/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
            console.log(resp);
            if (isSuccess) {
                callback("2元燃油优惠券");
            } else {

            }

        });

    }


    /**
     * 抽奖
     * @param phone 
     */
    public static GetMemberZJ(phone: string, callback: (arg0: boolean, arg1: object) => void) {
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/ZJ/GetMember", paramStr, (isSuccess, resp) => {
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
                callback(false, message);
            }
        });
    }

    /**
     * 抽奖
     * @param phone 
     */
    public static GetRewardZJ(phone: string, callback: (arg0: string) => void) {
        let param = {
            "phone": phone
        };

        let paramStr = JSON.stringify(param);
        HttpUtil.post(this.BaseUrl + "/ZJ/ReceiveMemberCoupon", paramStr, (isSuccess, resp) => {
            console.log(resp);
            if (isSuccess) {
                callback("2元燃油优惠券");
            } else {

            }

        });

    }

}
