import gameAnimation from './gameAnimation';
import {ajax} from "../units/ajax.js";
import URL from "../units/url.js";
import Bridge from '../units/JSbridge.js'
import {report, setPagedurations} from '../units/statReport.js'
import { createText,getCookie,setCookie, getQueryVariable, someDaySomeTime, GetRTime, TimeDate, getMyDate, getzf, textSize, HTMLElement} from "../units/units.js";
//调优化代码文件
import { setFarmland,setOperBtn,setLunckyDial,taskList, createHtmlDivElement } from "../units/setFarmland.js";
import Scenes from "../common/Scenes.js"
import Data from '../common/Data';
import MineCtrl from './mine/MineCtrl';
import Adapt from '../common/Adapt';
import RequestLoading from '../common/RequestLoading';
import { alerttTip1, alerttTip3, alerttTip4, hideHandTip, showHandTip } from '../common/alertTipFuc';
import Api from '../common/Api';
import helphavestCtrl from './helphavest/helphavestCtrl';
import Ad from '../units/Ad';
import Util from '../common/Util';
import sound from '../units/sound';
import soundUrl from '../units/soundUrl';
var tipAnimation = 1;//判断当前动画是否正在执行
let tipNum = 0;
export default class gameControl extends Laya.Script {

    constructor() { 
        super(); 
        gameControl.I=this;
        /** @prop {name:house, tips:"兑换中心", type:Node, default:null}*/
        /** @prop {name:bgImg, tips:"背景图", type:Node, default:null}*/
        /** @prop {name:rec1, tips:"头像", type:Node, default:null}*/
        /** @prop {name:exChangeList, tips:"兑换记录", type:Node, default:null}*/
        /** @prop {name:operPos, tips:"操作位置", type:Node, default:null}*/
        /** @prop {name:treeBtn, tips:"种子", type:Node, default:null}*/
        /** @prop {name:backpack, tips:"背包按钮", type:Node, default:null}*/
        /** @prop {name:sun, tips:"太阳", type:Node, default:null}*/
        /** @prop {name:userBox, tips:"个人信息", type:Node, default:null}*/
        /** @prop {name:userGold, tips:"金币值", type:Node, default:null}*/
        // /** @prop {name:lunckyDial, tips:"幸运转盘", type:Node, default:null}*/
        /** @prop {name:progressbarBox, tips:"进度条", type:Node, default:null}*/
        /** @prop {name:lunckyTipBox, tips:"转盘提示框", type:Node, default:null}*/
        /** @prop {name:earnCoins, tips:"赚金币", type:Node, default:null}*/
        /** @prop {name:jewelIcon, tips:"钻石入口", type:Node, default:null}*/
        /** @prop {name:dialymina, tips:"每日矿洞", type:Node, default:null}*/
        /** @prop {name:tillLand, tips:"种田入口", type:Node, default:null}*/
        /** @prop {name:closeBtn, tips:"关闭", type:Node, default:null}*/
        /** @prop {name:mineTime, tips:"抽卡游戏倒计时", type:Node, default:null}*/
        /** @prop {name:tipsBox, tips:"果树气泡", type:Node, default:null}*/
        
        this.isClick = 0;//防止连续点击
        this.isClickJewel =0;
    }
    onAwake() {
      this.gameAnimation=this.owner.getComponent(gameAnimation);
      Bridge.callHandler('getStaticsCi', '', (responseData)=>{
        Data.clientId = JSON.parse(responseData).clientId;
      });
      Bridge.callHandler('getUserInfo', '', (responseData)=>{
        Data.userId = JSON.parse(responseData).ID;
      });
      //适配
      Adapt.init(this.owner);
      // this.owner.lblVersion.text='v1.0.0';
      // Data.appVer = '';
      // this.owner.lblVersion.text = getQueryVariable(appVersion);
      Data.appVer = getQueryVariable("appVersion");
      // console.log=()=>{};
      //给兑换中心添加动画效果
      // let scale=this.house.scaleX;
      // let timeLine=new Laya.TimeLine();
      // timeLine.to(this.house,{ scaleX: scale+0.02, scaleY: scale+0.02 }, 1000).to(this.house,{ scaleX: scale, scaleY: scale }, 1000).play(0, true);
      if(Data.appVer>=295){
        this.closeBtn.visible = true;
      }else{
        this.closeBtn.visible = false;
      }
      if(Data.appVer>=297){
        Ad.configAdData(this.gameAnimation);
      }
      // Ad.configAdData(this.gameAnimation);
    }
    handle(timer){
      /**获取9点和18点时间戳,当前时间戳*/
      var nowTime = timer;
      var yearTime = getMyDate(timer).getFullYear();//获取年
      var monthTime = getMyDate(timer).getMonth() +1;//获取月
      var dateTime = getMyDate(timer).getDate();//获取日
      
      //拼装 固定时间 9 18 23:59:59
      var  oneTime = Date.parse(new Date(yearTime +'-'+ getzf(monthTime) +'-'+ getzf(dateTime) +' 09:00:00'))/1000;
      var  twoTime = Date.parse(new Date(yearTime +'-'+ getzf(monthTime) +'-'+ getzf(dateTime) +' 18:00:00'))/1000;
      var  threeTime = Date.parse(new Date(yearTime +'-'+ getzf(monthTime) +'-'+ getzf(dateTime) +' 23:59:59'))/1000;
      /**计算倒计时 */
      if(nowTime>oneTime&&nowTime<twoTime){//当前时间大于9点小于18点
        this.remainTime = GetRTime(nowTime,twoTime);
        this.mineTime.text = GetRTime(nowTime,twoTime)+'后开始';
        this.timer2 = twoTime;
      }else if(nowTime>oneTime&&nowTime>twoTime&&nowTime<threeTime){//当前时间大于18点和9点,小于00:00
        this.remainTime = GetRTime(nowTime,oneTime);
        this.mineTime.text = GetRTime(nowTime,oneTime+86400)+'后开始';
        this.timer2 = threeTime;
      }else if(nowTime<twoTime&&nowTime<twoTime&&nowTime>threeTime){//当前时间小于18点和9点,大于00:00
        this.remainTime = GetRTime(nowTime,oneTime);
        this.mineTime.text = GetRTime(nowTime,oneTime)+'后开始';
        this.timer2 = oneTime;
      }
      if(nowTime==this.timer2){
        clearInterval(this.gameTimer);
        Data.gamedrawBoolen = true;
        this.dialymina.skin = 'drawcard/daily1.png';
        this.mineTime.visible = false;
      }
    }
    
    onEnable() {
      // Bridge.callHandler('getToken', '', (responseData)=>{
      //   if(!JSON.parse(responseData).token){
          
      //   }else{
      //     RequestLoading.show();
      //     setTimeout(() => {
      //       RequestLoading.hide();
      //     }, 3000);
      //   }
      // });
      RequestLoading.show();
      setTimeout(() => {
        RequestLoading.hide();
      }, 3000);
      Data.userLogo = Math.random().toString(36).slice(-6);//生成当前用户唯一标识，每次刷新界面会生成新的
      Data.commonPoint1  = this.operPos.localToGlobal(new Laya.Point(0, 0));//操作按钮位置 浇水和播种公用
      Data.pointSize1 = {
        width:this.operPos._width,
        height:this.operPos._height,
        x:this.operPos._parent.x,
        y:this.operPos._parent.y,
      }
      Data.pointSize3 = {
        width:this.goldRushBox._width,
        height:this.goldRushBox._height,
        centerY:this.goldRushBox.centerY,
      }
      Data.commonPoint3 = this.goldRushBox.localToGlobal(new Laya.Point(0, 0));//矿洞按钮位置
      
      //获取土地
      this.farmlandBox = this.owner.getChildByName("farmlandBox");
      this.farmland = this.farmlandBox.getChildByName("farmland");
      this.fameSign = this.farmlandBox.getChildByName("fameSign");//种植区指示牌
      this.fameFruitName = this.fameSign.getChildByName("fameFruitName");//种植区指示牌种植水果名称
      this.fameLevel = this.fameSign.getChildByName("fameLevel");//种植区指示牌土地登记
      this.tipMsg = this.tipsBox.getChildByName("tipMsg");//气泡内容
      
      //给种植物绑定点击事件
      this.treeBtn.on(Laya.Event.MOUSE_DOWN,this,this.treeClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.fameSign.on(Laya.Event.MOUSE_DOWN,this,this.fameSignClick);
    }

    onStart(){
      this.createProgress()//首次进入默认执行
      this.house.on(Laya.Event.MOUSE_DOWN,this,this.houseClick);
      this.backpack.on(Laya.Event.MOUSE_DOWN,this,this.backpackClick);
      this.operPos.on(Laya.Event.MOUSE_DOWN,this,this.operPosClick);
      this.exChangeList.on(Laya.Event.MOUSE_DOWN,this,this.exChangeListClick)
      this.rec1.on(Laya.Event.MOUSE_DOWN,this,this.headImgListClick)
      // this.lunckyDial.on(Laya.Event.MOUSE_DOWN,this,this.lunckyDialClick);
      this.earnCoins.on(Laya.Event.MOUSE_DOWN,this,this.earnCoinsClick);
      this.jewelIcon.on(Laya.Event.MOUSE_DOWN,this,this.jewelIconClick);
      this.dialymina.on(Laya.Event.MOUSE_DOWN,this,this.dialyminaClick);
      this.tillLand.on(Laya.Event.MOUSE_DOWN,this,this.tillLandClick);
      
      this.userBox.getChildByName("myExp").on(Laya.Event.MOUSE_DOWN,this,this.userBoxClick);
    }
    createProgress() {
      //设置进度条
      // this.userBox = this.owner.getChildByName("rec1");
      this.goldBox = this.owner.getChildByName("rec2");
      this.jewBox = this.owner.getChildByName("rec3");
      createText('0W',26,'userGoldNum','#2E8B89',82,26,'Microsoft YaHei',this.goldBox,'center','','','','','')
      createText('0W',26,'userjewNum','#2E8B89',82,26,'Microsoft YaHei',this.jewBox,'center','','','','','')
      console.log("当前链接",window.location.href)
      this.getfameMsg()
      this.getFameLandInfo();
      this.getExtSceneInfo();
      this.getInfoByLocZW();
      Data.tokenKey = true;
      this.MineCtrilFun();
      setTimeout(() => {
        this.setExposureReport()
      }, 5000);
      
    }
    /**关闭按钮 */
    closeBtnClick(){
      Bridge.callHandler('toColse', '', (responseData)=>{});
    }
    MineCtrilFun(){
      MineCtrl.I.init();
    }
    userBoxClick(){
      Laya.Dialog.open(Scenes.plantRule);
    }
    /**更新金币显示数目 */
    updateCoin(){
      let coin=Math.floor(Data.coin);
      coin = coin> 9999 ? (Math.floor(coin/1000)/10) + 'W' : coin;
      if(!this.goldBox);
      this.goldBox.getChildByName("userGoldNum").text = coin;

      this.updateWaterCoinColor();
    }

    /**更新钻石显示数目 */
    updateJewel(){
      let jewel=Math.floor(Data.jewel);
      jewel = jewel> 9999 ? (Math.floor(jewel/1000)/10) + 'W' : jewel;
      this.jewBox.getChildByName("userjewNum").text = jewel;
    }
    /**每日矿洞 */
    dialyminaClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          if(Data.gamedrawBoolen==true){
            clearInterval(this.gameTimer);
            Laya.Dialog.open(Scenes.gamebox,false);
          }else{
            Laya.Dialog.open(Scenes.Tip, true, {
              content: this.remainTime +'后开启每日矿洞'
            });
          }
        }
      });
      
      // Laya.Dialog.open(Scenes.gamebox,false);
    }
    /**种田游戏 */
    tillLandClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          //种田游戏中定时器数组设空
          Data.fameTimer=[];
          if(this.spHand){
            Util.removeHandTip(this.spHand);
            this.spHand=null;
          }
          // Data.fameTimer = [];
          Laya.timer.clearAll(this);
          Laya.Dialog.open(Scenes.tillLandPage,false);
        }
      });
      // Data.fameTimer=[];
      // if(this.spHand){
      //   Util.removeHandTip(this.spHand);
      //   this.spHand=null;
      // }
      // Laya.timer.clearAll(this);
      // Laya.Dialog.open(Scenes.tillLandPage,false);
    }
    /**更新转盘上的小数字 */
    updateWheelNum(num){
      if(num){
        this.owner.lunckyNum.text=num;
      }else{
        this.owner.lunckyNumImg.visible=false;
      }
    }
    fameSignClick(){
      Laya.Dialog.open(Scenes.plantRule);
    }
    /**更新浇水按钮上的金币颜色 */
    updateWaterCoinColor(){
      let scoopGoldNum=this.owner.scoopGoldNum;
      if(Data.coin<Data.waterNeedCoinNum){
        scoopGoldNum.color = '#ea482b';
        scoopGoldNum.strokeColor = '#ea482b';
      }else{
        scoopGoldNum.color = '#FFFFFF';
        scoopGoldNum.strokeColor = '#62503B';
      }
    }
    /**获取农场主信息 */
    getfameMsg(){
      ajax({
        type: 'POST',
        url: URL.getFarmInfo,
        data:{},
        dataType:'json',
        success:(fameMsg)=>{
          console.log("农场主信息",fameMsg);
          if(fameMsg.code==1){
            Data.userId = fameMsg.data.userId;
            Data.exp = fameMsg.data.exp;
            Data.maxExp = fameMsg.data.maxExp;
            setCookie("landlevel",fameMsg.data.level,1)
            Data.level = fameMsg.data.level;
            Data.coin=fameMsg.data.coin;
            Data.jewel=fameMsg.data.jewel;
            if(fameMsg.data.puzzleInfo.gameChance==0){
              this.dialymina.skin = 'drawcard/daily2.png';
              this.mineTime.visible = true;
              var curTs = fameMsg.data.curTs;
              this.gameTimer = setInterval(() =>{
                curTs = curTs + 1;
                this.handle(Number(curTs+1))
              },1000);
              Data.gamedrawBoolen = false;
            }else{
              Data.gamedrawBoolen = true;
              this.dialymina.skin = 'drawcard/daily1.png';
              this.mineTime.visible = false;
            }
            if(Data.level>9){
              this.bgImg.skin = 'comp/bg1.png'
            }
            // this.userBox.getChildByName("headImg").skin = fameMsg.data.headImg;
            this.createHeadImgMask(fameMsg.data.headImageBit);
            // helphavestCtrl.I.init(fameMsg.data.znBtn);
            if(Data.plantStatus==1&&Data.exp>60&&Data.coin>=60){
              setTimeout(() => {
                if(Data.coin>=60&&Data.level==1){
                  showHandTip(this.owner);
                }
              }, 2000);
            }
            if(Data.level>1){
              hideHandTip()
            }
            //计算当前经验值
            if(Data.maxExp>0){
              this.nowExp = Number(Math.round(Data.exp / Data.maxExp * 10000) / 10000);
            }else{
              this.nowExp = 0;
            }
            //获取
            Laya.Tween.to(this.userBox.getChildByName("myExp"), {value:this.nowExp}, 500, Laya.Ease.sineInOut);
            this.userBox.getChildByName("myLevel").text = '农场'+Data.level+'级';
            this.fameLevel.text = '土壤:'+Data.level+'级';
            Data.expValue = Data.exp> 9999 ? (Math.floor(Data.exp/1000)/10) + 'W' : Data.exp;
            Data.maxExpValue = Data.maxExp> 9999 ? (Math.floor(Data.maxExp/1000)/10) + 'W' : Data.maxExp;
            this.userBox.getChildByName("myExpValue").text = Data.expValue+'/'+Data.maxExpValue;
            if(Data.exp>99999999&&Data.maxExp>99999999){
              this.userBox.getChildByName("myExpValue").fontSize = 17;
            }
            this.updateCoin();
            this.updateJewel();
            //根据接口返回农场经验判断是否为新手
            
          }else{
            this.userBox.getChildByName("myExp").value = 0;
            this.userBox.getChildByName("myLevel").text = '农场1级';
            this.userBox.getChildByName("myExpValue").text = '0/'+Data.maxExp;
            this.goldBox.getChildByName("userGoldNum").text = '0';
            this.jewBox.getChildByName("userjewNum").text = '0';
          }

        }
      })
    }
    /**获取农场植物信息 */
    getFameLandInfo(){
      ajax({
        type: 'POST',
        url: URL.getPlantInfo,
        data:{},
        dataType:'json',
        success: (PlantInfo)=>{
           //获取农场信息，全部初始化
          var farmland = this.farmlandBox.getChildByName("farmland");//农田容器
          var landZL = this.farmlandBox.getChildByName("landZL");//栅栏
          var treeBtn = this.farmlandBox.getChildByName("treeBtn");//植物容器
          var framProgressbar = this.farmlandBox.getChildByName("framProgressbar");//进度条容器
          var parentNode = framProgressbar.getChildByName("parentNode");//进度条右侧文字提示容器
          var scoopBtn = this.operPos;//按钮容器
          var scoopGold = this.operPos.getChildByName("scoopGold");//button容器
          var scoopGoldNum = scoopGold.getChildByName("scoopGoldNum");//button字体
          var operGold = scoopGold.getChildByName("operGold");//金币容器
          var scoop = scoopBtn.getChildByName("scoop");//操作图片容器
          console.log("农场植物信息",PlantInfo)
          this.PlantInfoMsg  = PlantInfo;
          if(PlantInfo.code==0){
            Data.plantStatus = PlantInfo.data.status;
            setTimeout(() => {
              if(Data.exp==0&&PlantInfo.data.status==0&&Data.level==1){
                alerttTip1()
              }
            }, 1500);
            Data.dayWateringMoney = PlantInfo.data.dayWateringMoney;
            //当天首次进入
            this.upDataPlantStatus();
            //根据种植状态更改种植操作按钮
            var fruitpID = PlantInfo.data.pid;
            Data.plantStatus = PlantInfo.data.status;
            Data.stepProcessPercent = PlantInfo.data.exp;
            if(fruitpID==1){
              this.fameFruitName.text = '种植:'+'苹果';
            }else if(fruitpID==2){
              this.fameFruitName.text = '种植:'+'橙子';
            }else if(fruitpID==3){
              this.fameFruitName.text = '种植:'+'橘子';
            }else if(fruitpID==4){
              this.fameFruitName.text = '种植:'+'猕猴桃';
            }else if(fruitpID==5){
              this.fameFruitName.text = '种植:'+'酥梨';
            }else{
              this.fameFruitName.text = '种植:';
            }
            if(PlantInfo.data.processStepIndex==9&&PlantInfo.data.status==3){
                var scoopIMG;
                if(fruitpID==1){
                  scoopIMG = 'comp/icon10.png';
                }else if(fruitpID==2){
                  scoopIMG = 'comp/icon7.png';
                }else if(fruitpID==3){
                  scoopIMG = 'comp/icon9.png';
                }else if(fruitpID==4){
                  scoopIMG = 'comp/icon8.png';
                }else if(fruitpID==5){
                  scoopIMG = 'comp/icon28.png';
                }
                scoopBtn.skin = scoopIMG;
                scoopGold.skin = 'comp/box29.png';
                framProgressbar.visible = true;
                framProgressbar.value = 1;
                parentNode.text = '100%';
            }
            //获取农田节点
            setFarmland(this.farmlandBox,PlantInfo,this.sun)
            setOperBtn(this.operPos,PlantInfo);
            //如果为浇水阶段则提示
            this.getInfoByLocST();
            taskList(this.earnCoins,PlantInfo)
            
          }else{
              var scoopIMG;
              if(fruitpID==1){
                scoopIMG = 'comp/icon10.png';
              }else if(fruitpID==2){
                scoopIMG = 'comp/icon7.png';
              }else if(fruitpID==3){
                scoopIMG = 'comp/icon9.png';
              }else if(fruitpID==4){
                scoopIMG = 'comp/icon8.png';
              }else if(fruitpID==5){
                scoopIMG = 'comp/icon28.png';
              }
              scoopBtn.skin = scoopIMG;
              treeBtn.skin = null;//植物图片
              farmland.skin = 'comp/farmland1.png';
              framProgressbar.value = 0;//进度条
              parentNode.text = '0%';
              landZL.visible = false;//栅栏清除
              scoop.visible = true;
              scoop.width = 112;
              scoop.height = 121;
              scoop.pos(48,43);
              scoopGoldNum.text = '播种';
              scoopGoldNum.visible = true;
              operGold.visible = false;
              //按钮状态恢复初始状态
              scoopBtn.skin = 'comp/icon3.png';
              scoopGold.skin = 'comp/waterbtn.png';
              scoop.skin = 'comp/icon.png';
          }
        }
      })
    }
    changeLucky(){
      setLunckyDial(this.lunckyDial,this.lunckyTipBox,this.PlantInfoMsg);
    }
    /**获取种田场景返回信息 */
    getExtSceneInfo(){
      Api.getExtSceneInfo((response) => {
        console.log("种田场景信息",response);
        if(response.code==1&&response.data.ztScene!==null){
          let remHartMinSec = response.data.ztScene.remHartMinSec;
          if(remHartMinSec>0){
            let tillHands = setInterval(() => {
              remHartMinSec--;
              console.log("种田场景倒计时",remHartMinSec);
              if(remHartMinSec==0){
                this.showHandTip('scale');
                clearInterval(tillHands) 
              }
            }, 1000);
          }else{
            this.showHandTip('scale');
          }
        }
      });
    }
    jewelIconClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          Laya.Dialog.open(Scenes.fullSale);
        }
      });
      var params = {
        action_type:'点击',
        content:'钻石加号',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    treeClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          //状态为0是不作升级提示
          if(Data.plantStatus!==0){
            Laya.Dialog.open(Scenes.treeLevelDialog,false,this.PlantInfoMsg);
          }
        }
      });
      // if(Data.plantStatus!==0){
      //   Laya.Dialog.open(Scenes.treeLevelDialog,false,this.PlantInfoMsg);
      // }
    }

    //兑换记录
    exChangeListClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          Laya.Dialog.open(Scenes.exchangelist);
          Data.sceneValue = 2;
        }
      });
      Data.sceneValue = 2;
      var params = {
        action_type:'点击',
        content:'兑换记录',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    //兑换中心
    houseClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{
          });
        }else{
          Laya.Dialog.open(Scenes.exchangeCenter);
        }
      });
      // Laya.Dialog.open(Scenes.exchangeCenter);
      var params = {
        action_type:'点击',
        content:'兑换中心',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    //背包
    backpackClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          Laya.Dialog.open(Scenes.backpack)
        }
      });
      // Laya.Dialog.open(Scenes.backpack)
      var params = {
        action_type:'点击',
        content:'背包',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    operPosClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
        }else{
          if(Data.plantStatus==0){//0未播种
            Data.seedStatus = true;
            Laya.Dialog.open(Scenes.exchangeCenter);
          }else if(Data.plantStatus==1){//种植中
            // console.log("isClick",this.isClick)
            //阻止多次点击事件
            if(this.isClick==0) {
              this.isClick = 1;
              //事件
              this.operWatering();//浇水
              //定时器
              setTimeout(() => {
                this.isClick = 0;
              }, 4000);
            }else{
              // alert("请稍后")
            }
          }else if(Data.plantStatus==3){
            //调起收获窗口
            Laya.Dialog.open(Scenes.harvestPrompt)
          }
        }
      });
      // if(Data.plantStatus==0){//0未播种
      //   Data.seedStatus = true;
      //   Laya.Dialog.open(Scenes.exchangeCenter);
      // }else if(Data.plantStatus==1){//种植中
      //   // console.log("isClick",this.isClick)
      //   //阻止多次点击事件
      //   if(this.isClick==0) {
      //     this.isClick = 1;
      //     //事件
      //     this.operWatering();//浇水
      //     //定时器
      //     setTimeout(() => {
      //       this.isClick = 0;
      //     }, 4000);
      //   }else{
      //     // alert("请稍后")
      //   }
      // }else if(Data.plantStatus==3){
      //   //调起收获窗口
      //   Laya.Dialog.open(Scenes.harvestPrompt)
      // }
    }
    //添加用户升级弹窗 
    landFrameClick(fameland){
      setTimeout(() => {
        Laya.Dialog.open(Scenes.landUpgrade,false,fameland);
      }, 2000);
    }
    
    //播种接口
    operSeedFun(fruitpID){
      ajax({
        type: 'POST',
        url: URL.operSeed,
        data:{
          plid:fruitpID,
        },
        dataType:'json',
        // contentType:'application/json',
        success:(response)=>{
          var famelandData = response;
          if(famelandData.code==1){
            // setCookie("haveSeed",1);
            console.log("播种接口",famelandData)
            if(fruitpID==1){
              this.fameFruitName.text = '种植：'+'苹果';
            }else if(fruitpID==2){
              this.fameFruitName.text = '种植：'+'橙子';
            }else if(fruitpID==3){
              this.fameFruitName.text = '种植：'+'橘子';
            }else if(fruitpID==4){
              this.fameFruitName.text = '种植：'+'猕猴桃';
            }else if(fruitpID==5){
              this.fameFruitName.text = '种植：'+'酥梨';
            }
            var framland = this.owner.farmland;
            this.gameAnimation.createSoilAnimation(1,framland);
            Data.exp = famelandData.data.exp;
            Data.plantStatus = famelandData.data.status;
            this.PlantInfoMsg  = famelandData;
            if(Data.exp==0&&Data.plantStatus==1){
              setTimeout(() => {
                alerttTip3()
              }, 2000);
            }
          }else{
            alert(famelandData.msg);
          }
        },
        error:function(err){
          Laya.Dialog.open(Scenes.Tip, true, {content:err});
        }
      })
    }
    //浇水接口
    operWatering(){
      ajax({
        type: 'POST',
        url: URL.operWatering,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        success:(response)=>{
          var params = {
            action_type:'点击',
            content:'浇水',
            channel_name:'',
            content_id:1,
            content_cat:'',//矿工等级
            content_cat_id:'',//矿工数量
          }
          report(params);
          var famelandData = response;
          if(famelandData.code==1){
            Data.exp = famelandData.data.exp;
            var waterBtnType = famelandData.data.toolItemInfo.itemid;
            var operExp = famelandData.data.exp;
            //第一次浇水成功后显示矿洞挖矿功能指示
            hideHandTip()
            if(operExp==60&&famelandData.data.status==1){
              setTimeout(() => {
                alerttTip4();
              }, 3000);
            }
            this.getfameMsg();
            this.getInfoByLocST();
            var farmlandBox = this.owner.farmlandBox;
            this.gameAnimation.createScoopAnimation(2,waterBtnType,farmlandBox);
            console.log("浇水状态",famelandData);
            this.PlantInfoMsg  = famelandData;
            //判断是否需要弹出信用转盘
            if(famelandData.data.wheelFlag==1){
              setTimeout(() => {
                this.lunckyDialClick()
              }, 2000);
            }
            if(famelandData.data.znPopup){
              Laya.Dialog.open(Scenes.helpHarvest,true,{content:famelandData.data.znPopup})
            }
            if(famelandData.data.userEvent.userEventLevel_bf){
              setCookie("landlevel",famelandData.data.userEvent.userEventLevel_bf.Level,1)
              this.landFrameClick(famelandData);
            }

            if((famelandData.data.stepProcessPercent==0) && (famelandData.data.status!==2)){
              setTimeout(() => {
                Laya.Dialog.open(Scenes.treeLevelDialog,false,famelandData);
                this.PlantInfoMsg=famelandData;
              }, 2000);
            }
          }else{
             //当前code值不为1时，判断金币不足还是浇水次数达到上限
            if(famelandData.msg==="金币不足"){
                Laya.Dialog.open(Scenes.noGold);
            }else if(famelandData.msg==="浇水次数今日已达上限"){
                Laya.Dialog.open(Scenes.fishOper);
            }
            
          }
          Data.plantStatus = famelandData.data.status;
        },
        error:function(){
          var params = {
            action_type:'点击',
            content:'浇水',
            channel_name:'',
            content_id:0,
            content_cat:'',//矿工等级
            content_cat_id:'',//矿工数量
          }
          report(params);
        }
        
      })
    }
    //幸运转盘
    lunckyDialClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Laya.Dialog.open(Scenes.Spinwin);
    }
    //赚金币
    earnCoinsClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{
          });
        }else{
          Laya.Dialog.open(Scenes.missionSystems); 
        }
      });
      // this.lunckyDialClick()
      // Laya.Dialog.open(Scenes.Spinwin);
      // Laya.Dialog.open(Scenes.missionSystems);
      // Laya.Dialog.open(Scenes.Spinwin);
      // Laya.Dialog.open(Scenes.exchangelist);
      // let data = {
      //   content: "小镇新进了一批超大的土豆",
      //   imgUrl: "https://static-quickvideo.29293.com/img/farm/zn/bj_tudou.png",
      //   linkUrl: "https://bpthaj.sda4.top/egoods/details?platform_id=1&item_id=643676596196&activity_id=e35e6879d4fb4c2eb08729da27998cb4&app_key=exp..."
      // }
      // Laya.Dialog.open(Scenes.helpHarvest,false,{content:data})
      var params = {
        action_type:'点击',
        content:'赚金币',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      report(params);
    }
    headImgListClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Bridge.callHandler('toUserMain', '', (responseData)=>{
        // alert(responseData)
      });

    }
    createHeadImgMask(img){
      //带遮罩的显示对象
      var headImg=new Laya.Sprite();
      
      var http = /^http:\/\/.*/i.test(img);
      let img1;
      if (http) {
        img1 = img.replace("http","https")
      }
      headImg.loadImage(img);
      headImg.pos(-10, -3);
      headImg.zOrder = 3;
      headImg.width = 86;
      headImg.height = 86;
      //创建遮罩对象
      var headImgMask = new Laya.Sprite();
      //画一个圆形的遮罩区域
      headImgMask.graphics.drawCircle(7,3,43,"#ffffff");
      headImgMask.pos(36,40);
      headImgMask.zOrder = 3;
      headImgMask.width = 96;
      headImgMask.height = 96;
      headImg.mask=headImgMask;
      Data.headImg = headImg;
      this.owner.rec1.addChild(headImg);
    }
    /**获取手机等信息做埋点上报 */
    setExposureReport(){
      if(!getCookie("ifd")){
        setCookie("ifd",1);
      }
      let params = {
        user_id:Data.userId,//userid
        as:Data.userLogo,//每次进入农场不一样的值，农场内的行为事件相同
        ci:Data.userId,//userid
        et:'pageview',//事件类型(pageview-页面访问，pagedurations-页面 停留):pageview
        dur:'',//页面停留时长(秒),统计页面时长时候传递:
        il:Data.userId?1:0,//是否登录:1或0
        ifd:getCookie("ifd")?1:0,//是否今天第一次访问:1--是或0--否
        if:'',//是否第一次访问,通过第一次启动的日期和当前日期对比，如果当前日期大于第一次启动日期为老用户:1或0
        times:Date.parse(new Date())/1000,//当前时间戳总秒数:1562293343
        sv:'',//SDK版本号:1.0.1
        st:'',//SDK类型:APP
        inu:'',//新用户:1(老用户为0)，如果新用户，当天所有调用均为1
        action_type:'',
        content:'',
        channel_name:'',
        content_id:'',
        content_cat:'',
        content_cat_id:'',
        webclient_id:Data.clientId,
      };
      Api.setReport(params, (data)=>{
        // console.log("data",data);
        setInterval(() => {
          this.setPagedurationsTime()
        }, 5000);
      });
      
    }
    setPagedurationsTime(){
      Data.durNum = Number(Data.durNum + 5 - Data.durNum);
      var params = {
        dur:Data.durNum,
        action_type:'',
        content:'',
        channel_name:'',
        content_id:'',
        content_cat:'',//矿工等级
        content_cat_id:'',//矿工数量
      }
      setPagedurations(params);
    }
    showHandTip(string){
      let spHand=Util.showHandTip(string);
      this.tillLand.addChild(spHand);
      spHand.pos(60, 0)
      spHand.tlMove.play(0, true);
      this.spHand=spHand;
    }
    //当前页面首次登录植物状态刷新替换
    upDataPlantStatus(){
      //当前账户未浇水，无论什么情况下都设置为枯萎状态
      if(Data.dayWateringMoney==0){
        setCookie('firstLogin',true);
      }else{
        //当前账户已浇水,状态先更改为false
        setCookie('firstLogin',false);
        //第一种情况：另外一个app中首次进入无cookie，
        if(getCookie('firstLogin')==null){
          setCookie('firstLogin',false);
        }
        //第二种情况：另外一个app中二次进入未操作浇水，无更改,cookie原为true，此时更改为false
        if(getCookie('firstLogin')=='true'){
          setCookie('firstLogin',false);
        }
      }
    }
    //植物气泡
    getInfoByLocZW(){
      Api.getInfoByLoc('UPPLANT',(response) => {
        console.log("植物气泡信息",response);
        if(response.code==1){
          Data.ByLocZW = response.data.contents;
          Data.ZWdpsec = response.data.dpsec*1000;//显示秒数
          Data.ZWivsec = response.data.ivsec*1000;//显示间隔数
          if(Data.ByLocZW.length>0){
            this.animationTip();
          }
          
        }
      });
    }
    //水桶气泡
    getInfoByLocST(){
      Api.getInfoByLoc('UPPAIL',(response) => {
        console.log("水桶气泡信息",response);
        if(response.code==1){
          Data.ByLocST = response.data.contents;
          Data.STdpsec = response.data.dpsec*1000;//显示秒数
          Data.STivsec = response.data.ivsec*1000;//显示间隔数
          if(Data.ByLocST.length>0){
            this.changeLucky();
          }
          
        }
      });
    }
    animationTip(){
      //设置转盘提示框(动画)每8秒出现一次，停留两秒
      if (tipAnimation == 1) {
        tipAnimation = 0;
        this.innerRoundRecursion()
      }
    }
    innerRoundRecursion(){
        if(tipNum==0){
          //根据字数计算高度
          let zwNum = Math.ceil(Data.ByLocZW[tipNum].content.length/11);
          let findFont = Data.ByLocZW[tipNum].content.replace(/[^\d]/g, "");
          let divHeight;//富文本高度
          let contextHeight;//富文本的内容实际高度
          if(zwNum>1){
            this.tipsBox.height = zwNum*30+70+(zwNum-1)*8;//30位字体大小 70为补充的高度值 8为行间距
            divHeight = zwNum*30+74+(zwNum-1)*8;
            contextHeight = zwNum*30
          }else{
            this.tipsBox.height = 78;//30位字体大小 70为补充的高度值 8为行间距
            divHeight = 68;
            contextHeight = zwNum*30
          }
          var newStr = Data.ByLocZW[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
          let divHtml = `<div style='font-size:30px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
          createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.tipsBox,8,contextHeight);
          tipNum = tipNum + 1;
        }else{
          if(tipNum<Data.ByLocZW.length){
                //根据字数计算高度
            let zwNum = Math.ceil(Data.ByLocZW[tipNum].content.length/11);
            let findFont = Data.ByLocZW[tipNum].content.replace(/[^\d]/g, "");
            let divHeight;//富文本高度
            let contextHeight;//富文本的内容实际高度
            if(zwNum>1){
              this.tipsBox.height = zwNum*30+70+(zwNum-1)*8;//30位字体大小 70为补充的高度值 8为行间距
              divHeight = zwNum*30+74+(zwNum-1)*8;
              contextHeight = zwNum*30
            }else{
              this.tipsBox.height = 78;//30位字体大小 70为补充的高度值 8为行间距
              divHeight = 68;
              contextHeight = zwNum*30
            }
            var newStr = Data.ByLocZW[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
            let divHtml = `<div style='font-size:30px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
            createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.tipsBox,8,contextHeight);
            tipNum = tipNum + 1;
          }else if(tipNum==Data.ByLocZW.length){
            tipNum = 0;
            let zwNum = Math.ceil(Data.ByLocZW[tipNum].content.length/11);
            let findFont = Data.ByLocZW[tipNum].content.replace(/[^\d]/g, "");
            let divHeight;//富文本高度
            let contextHeight;//富文本的内容实际高度
            if(zwNum>1){
              this.tipsBox.height = zwNum*30+70+(zwNum-1)*8;//30位字体大小 70为补充的高度值 8为行间距
              divHeight = zwNum*30+74+(zwNum-1)*8;
              contextHeight = zwNum*30
            }else{
              this.tipsBox.height = 78;//30位字体大小 70为补充的高度值 8为行间距
              divHeight = 68;
              contextHeight = zwNum*30
            }
            var newStr = Data.ByLocZW[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
            let divHtml = `<div style='font-size:30px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
            createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.tipsBox,8,contextHeight);
            tipNum = tipNum + 1;
          }
        }
        Laya.Tween.to(this.tipsBox,{
          scaleX: 1,
          scaleY: 1,
          pivotX: 200,
          pivotY: 100,
        },500,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
          Laya.Tween.to(this.tipsBox,{
            scaleX: 0,
            scaleY: 0,
            pivotX: 200,
            pivotY: 100,
          },500,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
            setTimeout(() => {
              this.innerRoundRecursion();
            },Data.ZWivsec);
          },null,true),Data.ZWdpsec);
        },null,true));
    }
}