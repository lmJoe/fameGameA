import { fameModuleUI } from "./../ui/layaMaxUI";
import Data from "../common/Data";
import Api from "../common/Api";
import { countdown } from "../units/units";
import homePages from "./homePages";
import Scenes from "../common/Scenes";
import sound from "../units/sound";
import soundUrl from "../units/soundUrl";
let clickTime=0;
let timerVal = {};
let timerVal2 = {};
let djsTimeObj={}
export default class fameModule extends fameModuleUI {
  constructor() { 
    super(); 
    fameModule.I=this;
  }

  onEnable() {
    this.menu.on(Laya.Event.MOUSE_DOWN,this,this.MenuClick);
    //获取农田中每块地 放入一个数组中
    this.land1 = this.fameLand.getChildByName('land1');
    this.land2 = this.fameLand.getChildByName('land2');
    this.land3 = this.fameLand.getChildByName('land3');
    this.land4 = this.fameLand.getChildByName('land4');
    this.land5 = this.fameLand.getChildByName('land5');
    this.land6 = this.fameLand.getChildByName('land6');
    this.landArr=[this.land1,this.land2,this.land3,this.land4,this.land5,this.land6];
    this.landArr.forEach(element => {
      let havestBtn = element.getChildByName("havestBtn");
      let seedBtn = element.getChildByName("seedBtn");
      let panel = element.getChildByName("cropsTime").getChildByName("panel");
      panel.width = 0;
      let tl=new Laya.TimeLine();
      havestBtn.tlMove=tl;
      tl.to(havestBtn, {x:43, y:-60}, 600).to(havestBtn, {x:43, y:-80}, 600)
      havestBtn.tlMove.play(0, true);

      let tl1=new Laya.TimeLine();
      seedBtn.tlMove=tl1;
      tl1.to(seedBtn, {x:43, y:-12}, 600).to(seedBtn, {x:43, y:-32}, 600)
      seedBtn.tlMove.play(0, true);
    });
  }
  /**收获 */
  gameHarvest(recordId,cell){
    Api.gameHarvest(recordId, (response) => {
      console.log("收获结果",response);
      if(response.code==1){
        cell.getChildByName("cropsTime").visible = false;
        cell.getChildByName("cropsImg").visible = false;
        cell.getChildByName("havestBtn").visible = false;
        cell.getChildByName("seedBtn").visible = true;
        // homePages.I.upDatatillcrops(cropsId);
        Data.cropMenuShow = false;
        homePages.I.getMainScene();
        //更新钞票
        Data.bill += response.data.bill;
        homePages.I.upDatatillBill();
        cell.getChildByName("awardMoney").getChildByName("awardNum").text = '+'+response.data.bill;
        // this.awardMoney = cell.getChildByName("awardMoney");
        cell.getChildByName("awardMoney").visible = true;
        cell.getChildByName("awardMoney").alpha = 1;
        Laya.Tween.to(cell.getChildByName("awardMoney"),{
          y: -50,
        },500,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
          //添加动画效果 动画完成后执行Handler处理器的方法;
          Laya.Tween.to(cell.getChildByName("awardMoney"),{
            alpha: 0,
          },200,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
            //添加动画效果 动画完成后执行Handler处理器的方法;
            cell.getChildByName("awardMoney").visible = false;
            cell.getChildByName("awardMoney").y = 0;
          }))
        }))
      }else{
        // Laya.Dialog.open(Scenes.Tip,false,{content:response.msg})
      }
    });
  }
  /**创建列表 */
  createfameList(){
    Data.landStatusArr = [];
    //获取当前数组中的土地状态值
    Data.createList.forEach(element => {
      let obj={
        fieldId:element.fieldId,
        status:element.status,
      }
      Data.landStatusArr.push(obj);
    });

    console.log("数组",Data.createList);
    this.landArr.forEach((element,index) => {
      let havestBtn = element.getChildByName("havestBtn");
      let seedBtn = element.getChildByName("seedBtn");
      let cropsImg = element.getChildByName("cropsImg");
      let cropsTime = element.getChildByName("cropsTime");
      let fameImg = element.getChildByName("fameImg");
      
      //给收获和种植按钮增加点击事件
      havestBtn.on(Laya.Event.MOUSE_DOWN,this,this.landClick,[Data.createList[index],element]);
      seedBtn.on(Laya.Event.MOUSE_DOWN,this,this.landClick,[Data.createList[index],element]);
      fameImg.on(Laya.Event.MOUSE_DOWN,this,this.landClick,[Data.createList[index],element]);
      if(Data.createList[index].fields.length!==0){
        cropsImg.visible=true;
        cropsTime.visible=true;
        //根据当前事件进行判断植物的状态
        /**
         * 获取种植时间seedTs
         * 获取当前服务器时间
         * 获取当前植物成长需要的时间growSec
         */
        let seedTs = Data.createList[index].seedTs;
        let serTimes = Data.createList[index].serTimes;
        let growSec = Data.createList[index].growSec;
        if(seedTs+growSec<serTimes){
          //如果种植时间+成长时间小于服务器时间，则当前植物处于成熟阶段
          cropsImg.skin=Data.createList[index].fields[2].imgurl;
          cropsImg.visible=true;
          havestBtn.visible=true;
          cropsTime.visible=false;
          seedBtn.visible=false;
          
        }else{
            this.stageTimerUI(element,Data.createList[index],index);
            //如果种植时间+成长时间大于服务器时间，则当前植物处于生长阶段
            let timeValue = "value"+index;
            timerVal2[timeValue] = growSec-(serTimes-seedTs);
            //如果当前差值大于等于24位为第1阶段
            seedBtn.visible=false;
            if(timerVal2[timeValue] >= Data.createList[index].fields[0].sec){
              cropsImg.skin=Data.createList[index].fields[0].imgurl;
              cropsImg.bottom=50;
              cropsTime.visible = true;
              
            }else if((timerVal2[timeValue]<Data.createList[index].fields[0].sec)&&(timerVal2[timeValue]>=Data.createList[index].fields[1].sec)){
              //如果当前差值小于24且大于等于6
              cropsImg.skin = Data.createList[index].fields[1].imgurl;
              cropsImg.bottom=32;
              cropsTime.visible = true;
              
            }else if((timerVal2[timeValue]>0)&&(Data.createList[index].fields[2].sec>timerVal2[timeValue])){
              //如果当前差值大于0小于6
              cropsImg.skin = Data.createList[index].fields[1].imgurl;
              cropsImg.bottom=32;
              cropsTime.visible = true;
              
              // Data.fameData[index].status = 3;
            }else if(timerVal2[timeValue]=0){
              cropsImg.skin = Data.createList[index].fields[2].imgurl;
              cropsImg.bottom=32;
              havestBtn.visible=true;
              cropsTime.visible = false;
              
            }
          
        }
        
      }else{
        //当前阶段为农田未种植阶段
        cropsImg.visible=false;
        cropsTime.visible=false;
        if(Data.cropMenuShow==false){
          seedBtn.visible=true;
        }else{
          seedBtn.visible=false;
        }
        
      }
      
    });
  }
  landClick(dataScource,cell){
    let obj = Data.landStatusArr.find(o => o.status === 1||o.status === 3);
    this.landArr.forEach((element,index) => {
      if(Number(element.name.replace("land",""))===dataScource.fieldId){
        element.getChildByName("fameMc").visible = true;
      }else{
        element.getChildByName("fameMc").visible = false;
      }
    });
    if(obj!==undefined){
      sound.playSound(soundUrl.playSoundClick,1);
      switch (dataScource.status) {
        case 1:
          var fieldId = dataScource.fieldId;
          Laya.Dialog.open(Scenes.cropsMenu,false,{fieldId:fieldId});
          this.seedBtnShow(1);
          break;
        case 2:
          //找出数组中值为1的下标
          var fieldId = dataScource.fieldId;
          Laya.Dialog.open(Scenes.cropsMenu,false,{fieldId:fieldId});
          this.seedBtnShow(1);
          break;
        case 3:
          let recordId = dataScource.recordId;
          let cropsId = dataScource.cropsId;
          this.gameHarvest(recordId,cell)
          break;
      }
    }
    
  }
  /**
   * 种植按钮是否显示
   * num==1 隐藏 num==2 显示
  */
  seedBtnShow(num){
    this.landArr.forEach((element,index) => {
      if(num==1){
        element.getChildByName("seedBtn").visible = false;
      }else{
        if(Data.createList[index].status==1){
          element.getChildByName("seedBtn").visible = true;
        }
        
      }
      
    });
  }
  /**倒计时处理UI */
  stageTimerUI(cell,dataScource,index){
    let seedTs = dataScource.seedTs;
    let serTimes = dataScource.serTimes;
    let growSec = dataScource.growSec;
    let havestBtn = cell.getChildByName("havestBtn");
    let cropsImg = cell.getChildByName("cropsImg");
    let cropsTime = cell.getChildByName("cropsTime");
    let timeText = cell.getChildByName("cropsTime").getChildByName("timeText");
    let panel = cropsTime.getChildByName("panel");
    //将定时器存入数组中
    let hotbalTimer="timer"+index;
    let isincloud = false;
    for(let i=0;i<Data.fameTimer.length;i++){
      if(dataScource.fieldId==Data.fameTimer[i].id){
        isincloud = true;
      }
    }
    // if(Data.fameTimer.length!==0){
    //   isincloud = true;
    // }
    if(!isincloud){
      let obj = {
        id:dataScource.fieldId,
        timer:hotbalTimer,
      }
      djsTimeObj[hotbalTimer] = setInterval(() => {
        cropsImg.visible=true;
        cropsTime.visible=true;
        serTimes = serTimes+1;
        timeText.text = countdown(seedTs+growSec,serTimes);
        //如果种植时间+成长时间大于服务器时间，则当前植物处于生长阶段
        let timeValue = "value"+index;
        timerVal[timeValue] = growSec-(serTimes-seedTs);
        panel.width=Math.round((growSec-timerVal[timeValue])*(1/growSec)*120 * 100) / 100;
        //如果当前差值大于等于24位为第1阶段;
        if(timerVal[timeValue] >= dataScource.fields[0].sec){
          cropsImg.skin=dataScource.fields[0].imgurl;
          cropsImg.bottom=50;
          cropsTime.visible = true;
          
        }else if((timerVal[timeValue]<dataScource.fields[0].sec)&&(timerVal[timeValue]>=dataScource.fields[1].sec)){
          //如果当前差值小于24且大于等于6
          cropsImg.skin = dataScource.fields[1].imgurl;
          cropsImg.bottom=32;
          cropsTime.visible = true;
          
        }else if((timerVal[timeValue]>0)&&(dataScource.fields[1].sec>=timerVal[timeValue])){
          //如果当前差值大于0小于6
          cropsImg.skin = dataScource.fields[1].imgurl;
          cropsImg.bottom=32;
          cropsTime.visible = true;
        }else if(timerVal[timeValue]==0){
          cropsImg.skin = dataScource.fields[2].imgurl;
          cropsImg.bottom=32;
          havestBtn.visible=true;
          cropsTime.visible = false;
        }
        //如果当前服务器时间超过植物生长结束时间。则清除相对应的定时器
        console.log("定时器数组",Data.fameTimer)
        if(serTimes>=seedTs+growSec){
          for(let i=0;i<Data.fameTimer.length;i++){
            if(Data.fameTimer[i].id==dataScource.fieldId){
              Data.landStatusArr[dataScource.fieldId-1].status=1;
              Data.createList[dataScource.fieldId-1].status=3;
              clearInterval(Data.fameTimer[i].timer)
              clearInterval(djsTimeObj[hotbalTimer])
              Data.fameTimer.splice(i,1)
            }
          }
          
          
        }
      }, 1000);
      Data.fameTimer.push(obj);
    }
    // //将定时器存入数组中
    // let obj = {
    //   id:dataScource.fieldId,
    //   timer:djsTimeObj[hotbalTimer],
    // }
    // let isincloud = false;
    // for(let i=0;i<Data.fameTimer.length;i++){
    //   if(dataScource.fieldId==Data.fameTimer[i].id){
    //     isincloud = true;
    //   }
    // }
    // if(!isincloud){
    //   Data.fameTimer.push(obj)
    // }
    
  }
  clearTimerAll(){
    //关闭所有定时器
    for(let i=0;i<Data.fameTimer.length;i++){
      clearInterval(djsTimeObj["timer"+i]);
      // Data.fameTimer[i] = [];    
    }
    // Data.fameTimer=[];
  }
  onDisable() {
    // this.clearTimerAll()
  }
  //菜园弹窗
  MenuClick(){
    Laya.Dialog.open(Scenes.menu,false);
  }
}