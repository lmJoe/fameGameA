import { countdown } from "../units/units";

export default {
    token:'',
    /**金币 */
    coin:0,
    /**钻石*/
    jewel:0,
    /**经验 */
    exp:0,
    /**水果id */
    fruitpID:'',
    /**订单详情 */
    orderMsg:{}, 
    /**新增地址页面来源 2-兑换记录 1-订单确认 以最终返回界面为准*/
    addressPageType:'',
    /**植物状态 */
    plantStatus:'',
    /**浇水需要的金币数 */
    waterNeedCoinNum:0,
    /**判断兑换中心是否选中左边按钮 */
    selectNum:0,
    /**订单地址id */
    addressID:'',
    /**地址收货人*/
    addressName:'',
    /**地址联系方式*/
    addressMobile:'',
    /**地址详情*/
    addressIntro:'',
    /**用户等级 */
    level:0,
    commonPoint1:'',/**播种和浇水全局位置 */
    commonPoint2:'',/**兑换中心种子全局位置 */
    commonPoint3:'',/**矿洞的全局位置 */
    commonPoint4:'',/**招募工人的全局位置 */
    commonPoint5:'',/**招募工人的全局位置 */
    pointSize1:{},/**播种和浇水的当前位置和高宽 */
    pointSize3:{},/**播种和浇水的当前位置和高宽 */
    pointSize4:{},/**招募工人高宽 */
    pointSize5:{},/**招募工人高宽 */
    buyMinerVal:false,/**是否已购买 */
    fruitNum:0,//当前用户拥有水果数量
    userLogo:'',//用户进入农场产生的随机标识
    durNum:0,/**用户停留界面时长 */
    userId:'',/**当前用户id */
    exChangedurNum:0,/**兑换中心停留时长 */
    appVer:'',/**应用版本号 */
    seedStatus:false,/**当前是否已种植 */
    stepProcessPercent:0,/**保存经验增长值 */
    plantStatus:0,/**当前植物种植状态：未播种，已播种待交水，待收货 */
    makeMoneyid:'',//赚钱id
    makeMoneydir:'',//赚钱url
    saveMoneydir:'',//省钱url
    treeHeight:0,//植物高度
    sceneValue:1,//当前兑换记录打开的入口
    tokenKey:false,
    nullToken:true,//true-未登录状态 false-已登录状态
    haveGetMineInfo:false,//矿场接口是否调用 true已调用 false未调用
    earnCount:1,
    countNum:0,//浏览页面领取次数
    gameDataObj:{},
    gameChance:0,//游戏次数
    drawer1:'',/**抽屉的第一个位置 */
    drawer2:'',/**抽屉的第二个位置 */
    drawer3:'',/**抽屉的第三个位置 */
    drawer4:'',/**抽屉的第四个位置 */
    haveMineIdArr:[],//抽卡游戏已挖到的id
    haveMineGold:0,//抽卡游戏最终金币数
    haveMineArr:[],//抽卡游戏重重结果组合
    gamedrawBoolen:false,//是否开启游戏
    aValue:1,
    balloonTime:45,//热气球时间
    boolean:true,//热气球定时器清除确定值 true-不清除 false-清除
    ballADreasonId:0,//热气球广告id
    nocoinreasonId:0,//缺金币广告id
    wateringreasonId:0,//浇水看广告id
    fameData:[
      {
        'fieldId':1,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      },
      {
        'fieldId':2,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      },
      {
        'fieldId':3,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      },
      {
        'fieldId':4,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      },
      {
        'fieldId':5,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      },
      {
        'fieldId':6,
        'growSec':0,
        'seedTs':0,
        'serTimes':0,
        'status':1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
        'landImg':'homePage/fameImg.png',
        'fields':[],
        'havestBtn':'',
        'seedBtn':'',
        'recordId':''
      }
    ],
    fameTimer:[],//农田定时器
    tillcrops:'',//种田果实订单农作物
    tillOrderCoin:'',//种田游戏当前订单奖励金币
    headImg:'',//当前头像
    expValue:0,//农场当前土地经验
    maxExpValue:0,//农场当前土地升级所需经验
    seedFieldId:0,//当前种植农田序号
    wrateingLeaveNum:'',//浇水广告剩余次数
    corpList:[
      {name:'番茄',imgurl:'homePage/crop1.png'},
      {name:'南瓜',imgurl:'homePage/crop3.png'},
      {name:'草莓',imgurl:'homePage/crop2.png'},
      {name:'小麦',imgurl:'homePage/crop4.png'},
      {name:'葡萄',imgurl:'homePage/crop5.png'},
      {name:'樱桃',imgurl:'homePage/crop6.png'},
      {name:'西瓜',imgurl:'homePage/crop7.png'},
      {name:'玉米',imgurl:'homePage/crop8.png'},
      {name:'包菜',imgurl:'homePage/crop9.png'},
    ],
    bill:0,
    tillOrderBill:0,
    landStatusArr:[],
    createList:[],
    landOrderBoolArr:[],
    cropMenuShow:false,
    dayWateringMoney:0,//当天浇水金币
    ByLocZW:{},//植物气泡信息
    ByLocST:{},//水桶气泡信息
    ByLocZT:{},//种田气泡信息
    ZWdpsec:0,//植物气泡显示时间
    STdpsec:0,//水桶气泡显示时间
    ZTdpsec:0,//种田气泡显示时间
    ZWivsec:0,//植物气泡间隔时间
    STivsec:0,//水桶气泡间隔时间
    ZTivsec:0,//种田气泡间隔时间
}