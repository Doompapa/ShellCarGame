import { _decorator, loader } from 'cc';
export class HttpUtil {

    public static get(url: string, params: object = {}, callback: (arg0: boolean, arg1: string) => void) {
        let dataStr = '';
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + encodeURIComponent(params[key]) + '&';
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
                    callback(true, JSON.parse(response));
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
            dataStr += key + '=' + encodeURIComponent(params[key]) + '&';
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
                    callback(false, response);
                }
            }
        };
        xhr.send();
    }

    //Post请求
    public static post(url: string, param: string, callback: (arg0: boolean, arg1: object) => void) {
        var xhr = loader.getXMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/application/json"
        );
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 300) {
                    let httpStatus = xhr.statusText;
                    callback(true, JSON.parse(response));
                } else {
                    callback(false, JSON.parse(response));
                }
            }
        };
        xhr.send(param);
    }
}