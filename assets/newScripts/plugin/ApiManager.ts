
import { _decorator, Component, Node } from 'cc';
import { HttpUtil } from '../Other/HttpUtil';
import MD5 from './MD5';
const { ccclass, property } = _decorator;

declare var param: any;
export class ApiManager {

    //https://www.doompapa.com
    public static BaseUrl = "http://localhost:8080";


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
            }else{

            }

        });

    }

}
