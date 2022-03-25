import { _decorator, loader } from 'cc';
import { Constants } from './constants';
import { customerListener } from './listener';
export class HttpUtil {

    public static get(url: string, params: object = {}, callback: (arg0: boolean, arg1: string) => void) {
        let dataStr = '';
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + encodeURIComponent((params as any)[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
        let xhr = loader.getXMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8;application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    let respJson = JSON.parse(response);
                    callback(respJson.code == 200, JSON.parse(response));
                } else {
                    callback(false, response);
                }
            }
        };
        xhr.send();
    }

    public static getToken(url: string, params: object = {}, callback: (arg0: boolean, arg1: string) => void) {
        let dataStr = '';
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + encodeURIComponent((params as any)[key]) + '&';
        })
        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
        let xhr = loader.getXMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8;application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    callback(true, response);
                } else {
                    customerListener.dispatch(Constants.GameStatus.SHOW_TOAST, "连接失败,请稍后再试");
                    callback(false, "");
                }
            }
        };
        xhr.send();
    }

    //Post请求
    public static post(url: string, param: string, callback: (arg0: boolean, arg1: object) => void) {
        var xhr = loader.getXMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json"
        );
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    let respJson = JSON.parse(response);
                    callback(respJson.code == 200, JSON.parse(response));
                } else {
                    callback(false, JSON.parse(response));
                }
            }
        };
        xhr.send(param);
    }
}