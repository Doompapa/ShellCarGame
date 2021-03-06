import { _decorator, Component, Node, Enum } from 'cc';
const { ccclass, property } = _decorator;

enum ColliderGroup { //定义碰撞组
    CAR = 1 << 0,   //赛车组
    ADDCOIN = 1 << 1,   //增速金币组
    NORMALCOIN = 1 << 2, //减速金币组
    CRACKs = 1 << 3 //裂隙
}
enum GameStatus {   //定义游戏状态
    GAME_START = 'start',       //游戏开始
    GAME_OVER = 'over', //游戏60秒时间结束
    GAME_CLOCK = 'clock',   //游戏计时开始
    GET_COIN = 'get-coin', //吃到金币
    GET_VSHELL = 'vshell', //吃到增益道具
    GET_KNOCK = 'knock', //吃到负增益道具
    CLOSE_HELP = 'close-help',    //关闭游戏操作指引
    OPEN_BOX = 'open-box', //打开宝箱
    SHOW_MASK = 'show-mask',
    CLICK_COMBOXITEM = 'click-comboxitem',
    OPEN_LOGIN = 'open-login',
    SHOW_TOAST = 'show-toast',
    SELECT_AREA = 'select-area',
    PHONE = "phone",
    ISLOGIN = "islogin",
    HIDE_SHARE = "hideshare",
}
// enum CoinScore {    //定义游戏金币类型
//     RED_COIN = 'red-coin',
//     YELLOW_COIN = 'yellow-coin'
// }

Enum(ColliderGroup);
Enum(GameStatus)
// Enum(CoinScore)

@ccclass('Constants')


export class Constants {

    public static ColliderGroup = ColliderGroup
    public static GameStatus = GameStatus

    // public static CoinScore = CoinScore
}
