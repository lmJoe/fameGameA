import { homePageUI } from "./../ui/layaMaxUI";
import Adapt_tillLand from "../common/Adapt_tillLand";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import fameModule from "./fameModule";
import Data from "../common/Data";
import Api from "../common/Api";
import goldAni from "../common/goldAni";
import sound from "../units/sound";
import soundUrl from "../units/soundUrl";
import { textSize } from "../units/units";
import { createHtmlDivElement } from "../units/setFarmland";
var Tween = Laya.Tween;
let taskId;
let tipNum = 0;
export default class homePages extends homePageUI {

    constructor() { 
      super();
      homePages.I=this;
    }
    onAwake(){
      // sound.stopMusic(soundUrl.miningSound)
      Adapt_tillLand.init(this);
      if(Data.maxExp>0){
        this.nowExp = Number(Math.round(Data.exp / Data.maxExp * 10000) / 10000);
      }else{
        this.nowExp = 0;
      }
      //获取
      Laya.Tween.to(this.persionInfo.getChildByName("myExp"), {value:this.nowExp}, 500, Laya.Ease.sineInOut);
      Data.headImg.pos(20,12.5)
      this.persionInfo.addChild(Data.headImg);
      this.persionInfo.getChildByName("jingyan").text = Data.expValue+'/'+Data.maxExpValue;
      this.persionInfo.getChildByName("level").text = '农场'+Data.level+'级';
      if(Data.exp>99999999&&Data.maxExp>99999999){
        this.persionInfo.getChildByName("jingyan").fontSize = 17;
      }
      this.getMainScene();
      this.getInfoByLoc();
      this.list = this.orderList.getChildByName('list');
      this.TipBox = this.operator.getChildByName('TipBox');
      this.tipMsg = this.TipBox.getChildByName('tipMsg');
      this.money = this.persionCoin.getChildByName('money');
      this.orderButton = this.orderList.getChildByName('orderButton');
      this.goldText = this.orderList.getChildByName('goldBox').getChildByName('text');
      this.moneyText = this.orderList.getChildByName('moneyBox').getChildByName('text');
      this.goldBox = this.orderList.getChildByName('goldBox');
      this.moneyBox = this.orderList.getChildByName('moneyBox');

      
    }
    onEnable() {
      this.backBtn.on(Laya.Event.MOUSE_DOWN,this,this.backBtnClick);
      this.orderButton.on(Laya.Event.MOUSE_DOWN,this,this.earnTaskPrize);
      
    }
    backBtnClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      fameModule.I.clearTimerAll();
      Laya.Dialog.close(Scenes.tillLandPage);
      gameControl.I.getExtSceneInfo();
      
    }
    onDisable() {
      console.log("关闭")
      Tween.clearTween(this.TipBox)
      Tween.clear(this.tweenAni);
    }
    //接口获取数据
    getMainScene(){
      Api.getMainScene((response) => {
        console.log("出场景信息",response);
        if(response.code==1){
          let responseData = response.data.fields;
          Data.tillcrops = response.data.taskOrder;
          Data.tillOrderCoin = response.data.taskOrder.prize.coin;
          Data.tillOrderBill = response.data.taskOrder.prize.bill;
          Data.bill = response.data.userInfo.bill;
          this.money.text = Data.bill;
          let serTimes = response.data.SerTs;
          if(Data.tillOrderCoin!==0||Data.tillOrderBill!==0){
            this.goldBox.visible = true;
            this.moneyBox.visible = true;
            this.goldBox.x = 553;
            this.moneyBox.x = 553;
            if(Data.tillOrderCoin==0){
              this.goldBox.visible = false;
              this.moneyBox.x = 553;
            }
            if(Data.tillOrderBill==0){
              this.moneyBox.visible = false;
              this.goldBox.x = 553;
            }
          }else if(Data.tillOrderCoin!==0&&Data.tillOrderBill!==0){
            this.goldBox.visible = true;
            this.goldBox.x = 588;
            this.moneyBox.visible = true;
            this.moneyBox.x = 505;
          }


          let objArr = [];
          //接口数据和自定义接口组合，需要的数据整合
          for(let i=0;i<responseData.length;i++){
            for(let j=0;j<6;j++){
              let obj;
              if(responseData[i]){
                if(responseData[i].fieldId == j+1){
                  let growTime = responseData[i]?responseData[i].seedTs+responseData[i].growSec:0;
                  obj = {
                    'fieldId':responseData[i]?responseData[i].fieldId:'',
                    'growSec':responseData[i]?responseData[i].growSec:'',
                    // 'growSec':100,
                    'seedTs':responseData[i]?responseData[i].seedTs:'',
                    'serTimes':serTimes,
                    'status':responseData[i]?response.data.SerTs>growTime?3:2:1,//当前种植物状态 未播种-1 成长中-2 待收获-3 默认为1
                    'landImg':'homePage/fameImg.png',
                    'fields':responseData[i]?responseData[i].stages:'',
                    'havestBtn':'',
                    'seedBtn':'',
                    'recordId':responseData[i]?responseData[i].recordId:'',
                    'cropsId':responseData[i]?responseData[i].cropsId:'',
                  };
                  //创建收获节点
                  objArr.push(obj)
                }
              }
            }
          }
          Data.createList = this.removeDuplicateObj(Data.fameData.concat(objArr));
          console.log("合并数据",Data.createList)
          fameModule.I.createfameList(Data.createList)

          this.createOrderList(Data.tillcrops);
          Data.landOrderBoolArr=[];
          
          Data.tillcrops.items.forEach(element => {
            if(element.fNum>element.mNum){
              Data.landOrderBoolArr.push(true);
            }else{
              Data.landOrderBoolArr.push(false);
            }
          });
          taskId =Data.tillcrops.taskId;
        }
      });
    }
    removeDuplicateObj(tempArr) {
      //去重
      for (let i = 0; i < tempArr.length; i++) {
          for (let j = i + 1; j < tempArr.length; j++) {
              if (tempArr[i].fieldId == tempArr[j].fieldId && tempArr[i].fields=='') {
                  tempArr.splice(i, 1);
                  j--;
              };
          };
      };
      //排序
      tempArr.sort(function(a,b){
        var x=a['fieldId'];//如果要从大到小,把x,y互换就好
        var y=b['fieldId'];
        return ((x<y)?-1:((x>y)?1:0));
      });
      return tempArr;
    };
    /**订单列表渲染 */
    createOrderList(arr){
      // 使用但隐藏滚动条
      this.list.hScrollBarSkin = "";
      this.list.selectEnable = true;
      this.list.renderHandler = new Laya.Handler(this, this.updateItem);
      this.list.array = arr.items;
      this.goldText.text='+'+arr.prize.coin;
      this.moneyText.text='+'+arr.prize.bill;
    }
    updateItem(cell, index) {
      let fNum = cell.dataSource.fNum;
      let mNum = cell.dataSource.mNum;
      cell.getChildByName("orderImg").skin = cell.dataSource.imgUrl;
      cell.getChildByName("orderTime").getChildByName("timeText").text = fNum+'/'+mNum;
      let panel = cell.getChildByName("orderTime").getChildByName("panel");
      panel.width = 83/mNum*fNum;
      if(fNum>=mNum){
        Data.landOrderBoolArr[index]=true;
        cell.getChildByName("orderTime").visible = false;
        cell.getChildByName("complete").visible = true;
      }else{
        Data.landOrderBoolArr[index]=false;
        cell.getChildByName("orderTime").visible = true;
        cell.getChildByName("complete").visible = false;
      }
      if(Data.tillcrops.items.length==1){
        this.list.getCell(0)._x = 250;
      }else if(Data.tillcrops.items.length==2){
        this.list.getCell(0)._x = 120;
        this.list.getCell(1)._x = 250;
      }else if(Data.tillcrops.items.length==3){
        this.list.getCell(0)._x = 0;
        this.list.getCell(1)._x = 140;
        this.list.getCell(2)._x = 290;
      }
      this.testOrderBool();
    }
    /**判断当前订单是否满足条件 */
    testOrderBool(){
      console.log("Data.landOrderBoolArr",Data.landOrderBoolArr);
      for(let i=0;i<Data.landOrderBoolArr.length;i++){
        if(Data.landOrderBoolArr[i]==false){
          this.orderButton.skin='homePage/jlbtn1.png';
          this.orderButton.disabled=true;
          break;
        }else{
          this.orderButton.skin='homePage/jlbtn.png';
          this.orderButton.disabled=false;
        }
      }
    }
    /**更新农作物数量 */
    // upDatatillcrops(cropsId){
    //   Data.tillcrops.items.forEach(element => {
    //     if(element.id==cropsId){
    //       element.fNum = element.fNum+1;
    //       let obj = Data.landOrderBoolArr.find(o => o == false);
    //       if(obj==undefined){
    //         this.testOrderBool()
    //       }
    //     }
        
    //   });
    //   this.createOrderList(Data.tillcrops);
    // }
    //领取奖励
    earnTaskPrize(){
      sound.playSound(soundUrl.playSoundClick,1);
      Api.earnTaskPrize(taskId,(response) => {
        console.log("领取奖励",response);
        if(response.code==1){
          this.createOrderList(response.data);
          goldAni.goldAniFuc(Data.tillOrderCoin);
          Data.coin+=Data.tillOrderCoin;
          gameControl.I.updateCoin();
          Data.bill += Data.tillOrderBill;
          this.upDatatillBill()
        }
      });
    }
    //更新纸钞
    upDatatillBill(){
      this.money.text = Data.bill;
    }
    /**获取气泡信息列表 */
    getInfoByLoc(){
      Api.getInfoByLoc('UPZTPLAY',(response) => {
        console.log("气泡信息",response);
        if(response.code==1){
          Data.ByLocZT = response.data.contents;
          Data.ZTdpsec = response.data.dpsec*1000;//显示秒数
          Data.ZTivsec = response.data.ivsec*1000;//显示间隔数
          if(Data.ByLocZT.length>0){
            this.animationTip();
          }
          
        }
      });
    }
    animationTip(){
      //设置转盘提示框(动画)每8秒出现一次，停留两秒
      // if (tipAnimation == 1) {
      //   tipAnimation = 0;
        
      // }
      this.innerRoundRecursion()
    }
    innerRoundRecursion(){
      if(tipNum==0){
        //根据字数计算高度
        let zwNum = Math.ceil(Data.ByLocZT[tipNum].content.length/14);
        let findFont = Data.ByLocZT[tipNum].content.replace(/[^\d]/g, "");
        let divHeight;//富文本高度
        let contextHeight;//富文本的内容实际高度
        if(zwNum>1){
          this.TipBox.height = zwNum*24+60+(zwNum-1)*8;//24位字体大小 60为补充的高度值 8为行间距
          divHeight = zwNum*24+74+(zwNum-1)*8;
          contextHeight = zwNum*24
        }else{
          this.TipBox.height = 70;//24位字体大小 60为补充的高度值 8为行间距
          divHeight = 68;
          contextHeight = zwNum*24
        }
        var newStr = Data.ByLocZT[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
        let divHtml = `<div style='font-size:24px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
        createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.TipBox,8,contextHeight);
        tipNum = tipNum + 1;
      }else{
        if(tipNum<Data.ByLocZT.length){
              //根据字数计算高度
          let zwNum = Math.ceil(Data.ByLocZT[tipNum].content.length/14);
          let findFont = Data.ByLocZT[tipNum].content.replace(/[^\d]/g, "");
          let divHeight;//富文本高度
          let contextHeight;//富文本的内容实际高度
          if(zwNum>1){
            this.TipBox.height = zwNum*24+60+(zwNum-1)*8;//24位字体大小 60为补充的高度值 8为行间距
            divHeight = zwNum*24+74+(zwNum-1)*8;
            contextHeight = zwNum*24
          }else{
            this.TipBox.height = 70;//24位字体大小 60为补充的高度值 8为行间距
            divHeight = 68;
            contextHeight = zwNum*24
          }
          var newStr = Data.ByLocZT[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
          let divHtml = `<div style='font-size:24px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
          createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.TipBox,8,contextHeight);
          tipNum = tipNum + 1;
        }else if(tipNum==Data.ByLocZT.length){
          tipNum = 0;
          let zwNum = Math.ceil(Data.ByLocZT[tipNum].content.length/14);
          let findFont = Data.ByLocZT[tipNum].content.replace(/[^\d]/g, "");
          let divHeight;//富文本高度
          let contextHeight;//富文本的内容实际高度
          if(zwNum>1){
            this.TipBox.height = zwNum*24+60+(zwNum-1)*8;//24位字体大小 60为补充的高度值 8为行间距
            divHeight = zwNum*24+74+(zwNum-1)*8;
            contextHeight = zwNum*24
          }else{
            this.TipBox.height = 70;//24位字体大小 60为补充的高度值 8为行间距
            divHeight = 68;
            contextHeight = zwNum*24
          }
          var newStr = Data.ByLocZT[tipNum].content.replace(findFont,`<span style="color:#E84C00;font-size:40px;">${findFont}</span>`)
          let divHtml = `<div style='font-size:24px; font-family:SimHei; color:#000;width:345px;align:center;'>${newStr}</div>`;
          createHtmlDivElement(345,divHeight,'#000','center',divHtml,this.TipBox,8,contextHeight);
          tipNum = tipNum + 1;
        }
      }
      this.tweenAni = Tween.to(this.TipBox,{
        scaleX: 1,
        scaleY: 1,
        pivotX: 200,
        pivotY: 100,
      },500,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
        console.log("1")
        this.tweenAni = Tween.to(this.TipBox,{
          scaleX: 0,
          scaleY: 0,
          pivotX: 200,
          pivotY: 100,
        },500,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
          console.log("2")
          setTimeout(() => {
            this.innerRoundRecursion();
          },Data.ZTivsec);
        },null,true),Data.ZTdpsec);
      },null,true));
    }
    
}



