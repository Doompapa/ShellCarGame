
import { _decorator, Component, Node } from 'cc';
import { HttpUtil } from '../Other/HttpUtil';
import MD5 from './MD5';
const { ccclass, property } = _decorator;

declare var param: any;
export class ApiManager {

    private static apiKeyGD = "123456";
    private static EtpCodeGD = "ET201780306";

    public static GetMemberGD(phone: string) {
        var param: any = {}
        param = {
            'EtpCode': ApiManager.EtpCodeGD,
            'Phone': phone,
        }

        let signStr = "EtpCode=" + param.EtpCode + "&Phone=" + param.Phone + "&key=" + ApiManager.apiKeyGD;
        let sign = new MD5().hex_md5(signStr).toUpperCase();
        param['sign'] = sign;

        let paramStr = JSON.stringify(param);
        HttpUtil.post("https://shell-app.objectretail.com:9000/WebApi.ashx?type=TrdMemberMdl&method=GetMemberPointByPhone", paramStr, (isSuccess, resp) => {

            console.log(resp);

        });

    }

}
