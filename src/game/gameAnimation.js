import Api from "../common/Api";
import Data from "../common/Data";
import goldAni from "../common/goldAni";
import Scenes from "../common/Scenes";
import Ad from "../units/Ad";
import gameControl from "./gameControl";
import gameUI from "./gameUI";
import Audio from "../units/sound";
import soundUrl from "../units/soundUrl";
import particle from "../units/particle";
import { setCookie } from "../units/units";
var operAnimType;//判断播种或者浇水
var btnTypeCode;//判断浇水水桶
var waterAnimationType;//判断水桶浇水调用的动画
var waterMoveType;//判断调用浇水动作动画
var plantOperedNode;
let clickTime=0;
let hotBalloonTime=20000;//热气球在场景中从出现到消失的时间
export default class gameAnimation extends Laya.Script {
    constructor() { 
        super(); 
        gameAnimation.I=this;
        /** @prop {name:treeAni, tips:"植物", type:Node, default:null}*/
    }

    onEnable() {
      this.operPos = this.owner.getChildByName("operPos");
      this.scoopIcon = this.operPos.getChildByName("scoopBtn").getChildByName("scoop");
      this.gameUI = this.owner.getComponent(gameUI);
    }

    //创建热气球
    createAnimation(){
      var BalloonAni = Laya.Pool.getItemByCreateFun("Balloon", this.loadBalloonAnimation, this);
      BalloonAni.interval=100;//设置帧动画的时间间隔
      BalloonAni.zOrder=5;//层级
      BalloonAni.weight=1;//设置帧动画的时间间隔
      Laya.stage.addChild(BalloonAni);
    }

    loadBalloonAnimation(){
      this.BalloonAni = new Laya.Animation();
      this.BalloonAni.loadAnimation("animation/balloonAnimation.ani");
      this.BalloonAni.pos(-100, 380);
      this.BalloonAni.size(200,200)
      this.BalloonAni.play(0,true,'move');
      /**
       * 使用缓动动画流程：
       * 1、给需要移动的元素设置缓动后的样式属性即可
       */
      //绑定点击事件
      // 通过缓动动画控制 this.balloonAni位置移动、大小变化；整个动画耗时2秒
      this.BalloonAni.on(Laya.Event.MOUSE_DOWN,this,this.hotAirBalloonClick);
      console.log("this.owner._width",this.owner._width)
      Laya.Tween.to(this.BalloonAni,{
        x: this.owner._width,
      },20000,Laya.Ease.linearNone,Laya.Handler.create(this,() => {
        //添加动画效果 动画完成后执行Handler处理器的方法
          this.BalloonAni.on(Laya.Event.COMPLETE,this,this.clearHotAirBalloon);
      }))
      
      return this.BalloonAni;
    }

    clearHotAirBalloon(){
      if(this.BalloonAni){
        Laya.Animation.clearCache("animation/balloonAnimation.ani");
        Laya.Loader.clearRes("animation/balloonAnimation.ani");
        this.BalloonAni.clear();
        this.BalloonAni.destroy(true);
        this.BalloonAni = null;
      }
    }

    hotAirBalloonClick(){
      if(Laya.Browser.now() - clickTime <= 1000){
        console.log("点击失败");
        return ;
      }
      clickTime=Laya.Browser.now();
      Api.uploadHideEvent(Data.ballADreasonId,(data)=>{
        console.log("广告上报结果",data);
        if(data.data.leaveNum!==0){
          console.log("热气球广告剩余次数",data.data.leaveNum)
          Ad.addAd((data)=>{
            //isSuccess为1调取成功
            if(JSON.parse(data).isSuccess==1){
              //清除热气球定时器
              Data.boolean = false;
              this.clearHotAirBalloon();
              Ad.hotballoonTimer();
              Api.earnHidePrize(Data.ballADreasonId,1,(data)=>{
                console.log("广告成功领取奖励",data);
                goldAni.goldAniFuc(data.data);
                Data.coin+=data.data;
                gameControl.I.updateCoin();
              })
            }else{
              Laya.Dialog.open(Scenes.Tip,false,{content:'广告播放失败'})
              Api.earnHidePrize(Data.ballADreasonId,0,(data)=>{
                console.log("广告失败领取奖励",data);
              })
            }
          });
          
        }
      })

      
    }

    //创建水滴效果
    createWaterAnimation(){
      Audio.playSound(soundUrl.watering,0)
      if(btnTypeCode==2001){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water1", this.loadWaterAnimation, this);
      }else if(btnTypeCode==2002||btnTypeCode==2003){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water2", this.loadWaterAnimation, this);
      }else if(btnTypeCode==2004||btnTypeCode==2005){
        this.WaterAni = Laya.Pool.getItemByCreateFun("water3", this.loadWaterAnimation, this);
      }
      this.WaterAni.pos(plantOperedNode._width/2, -20);
      this.WaterAni.interval=20;//设置帧动画的时间间隔
      this.WaterAni.zOrder=3;//层级
      this.WaterAni.weight=1;//设置帧动画的时间间隔
      plantOperedNode.addChild(this.WaterAni);
      this.WaterAni.play(0,false,waterMoveType);

    }

    loadWaterAnimation(){
      var WaterAni = new Laya.Animation();
      if(btnTypeCode==2001){
        waterAnimationType = "waterAnimation3.ani";
        waterMoveType = 'waterMove3';
        
      }else if(btnTypeCode==2002||btnTypeCode==2003){
        
        waterAnimationType = "waterAnimation6.ani";
        waterMoveType = 'waterMove6';
      }else if(btnTypeCode==2004||btnTypeCode==2005){
        
        waterAnimationType = "waterAnimation10.ani";
        waterMoveType = 'waterMove10';
      }
      WaterAni.loadAnimation(waterAnimationType)
      WaterAni.on(Laya.Event.COMPLETE,this,clearWaterAnimation);
      function clearWaterAnimation(){
        WaterAni.removeSelf();
        Audio.stopSound(soundUrl.watering)
        // Laya.Pool.recover("water1", WaterAni);
        // Laya.Pool.recover("water2", WaterAni);
        // Laya.Pool.recover("water3", WaterAni);
    
      };
      return WaterAni;
    }
    //创建铲铲动画
    createSoilAnimation(num,parentNode){
      operAnimType = num;
      plantOperedNode = parentNode;
      this.scoopIcon.visible=false;
      this.SoilAni = new Laya.Animation();
      this.SoilAni.loadAnimation("animation/soilAnimation.ani");
      this.SoilAni.interval=55;//设置帧动画的时间间隔
      this.SoilAni.play(0,false,"scoopMove");//播放动画效果：从第0帧开始，循环播放，动画名称
      var SoilAniNode = new Laya.Sprite();
      SoilAniNode.addChild(this.SoilAni);
      plantOperedNode.addChild(SoilAniNode);
      this.SoilAni.pos(plantOperedNode._width/2,plantOperedNode._height/2);//设置动画的位置
      this.SoilAni.on(Laya.Event.COMPLETE,this,this.clearSoilAnimation);
    }
    
    createScoopAnimation(num,btnType,parentNode){ //num 1播种 2浇水
      operAnimType = num;
      btnTypeCode = btnType;
      plantOperedNode = parentNode;
      this.scoopIcon = this.owner.getChildByName("operPos").getChildByName("scoopBtn").getChildByName("scoop");
      this.scoopIcon.visible=false;
      
      let scoopAni = new Laya.Image();
      scoopAni.name = 'ScoopAniName';
      var scoopIMG ;
      if(Data.plantStatus==0){
        scoopIMG = "comp/icon.png"; 
      }else if(Data.plantStatus==1){
        scoopIMG = "comp/icon6.png";
        if(window.toolItemInfo!==null){
          var scoopID = window.toolItemInfo.itemid;
          var scoopIMG;
          if(scoopID==2001){
            scoopIMG = 'comp/icon6.png';
          }else if(scoopID==2002){
            scoopIMG = 'comp/icon12.png';
          }else if(scoopID==2003){
            scoopIMG = 'comp/icon13.png';
          }else if(scoopID==2004){
            scoopIMG = 'comp/icon14.png';
          }else if(scoopID==2005){
            scoopIMG = 'comp/icon15.png';
          }
        }
      }
      scoopAni.name = 'ScoopAniName';
      scoopAni.skin = scoopIMG; 
      scoopAni.interval=55;//设置帧动画的时间间隔
      plantOperedNode.addChild(scoopAni);
      scoopAni.y=-60;
      this.createTimerLine(scoopAni)
    }

    createTimerLine(target){
      var TimeLine = Laya.TimeLine,
			Event = Laya.Event;
      let timeLine = new TimeLine();
      // addLabel(label:String, offset:Number) offset: 标签事件相对于上个动画的偏移时间(单位：毫秒)
      timeLine.addLabel("turnLeft", 0).to(target, {x:plantOperedNode._width/3, rotation:-25}, 500, null, 0)
        .addLabel("turnRight", 300).to(target, {x:plantOperedNode._width/1.8}, 500, null, 0)
        .addLabel("turnLeft", 200).to(target, {x:plantOperedNode._width/3}, 500, null, 0)
        .addLabel("turnRight", 200).to(target, {x:plantOperedNode._width/1.8}, 500, null, 0);
      timeLine.play(0,false,"scoop");//播放动画效果：从第0帧开始，循环播放，动画名称
      timeLine.on(Event.COMPLETE, this, this.clearScoopButton, [target]);
      timeLine.on(Event.LABEL, this, this.onLabel);
    }

    clearScoopButton(target){
      //获取当前植物容器
      this.treeBtn = this.owner.getChildByName("farmlandBox").getChildByName("treeBtn");
      this.scoopBtn = this.owner.getChildByName("operPos").getChildByName("scoopBtn");
      
      target.removeSelf();
      if(Data.plantStatus==0){
        this.scoopBtn.texture = "comp/icon3.png";
      }else if(Data.plantStatus==1){
        this.scoopBtn.texture = "comp/icon2.png";
      }
      this.scoopIcon.visible=true;
      this.treeAnimation();
    }

    clearSoilAnimation(){
      console.log("铲土销毁完成")
      Laya.Animation.clearCache("animation/soilAnimation.ani");
      Laya.Loader.clearRes("animation/soilAnimation.ani");
      this.SoilAni.clear();
      this.SoilAni.destroy(true);
      this.SoilAni = null;
      this.scoopIcon.visible=true;
      this.gameUI.addTreeNode();
      setCookie('firstLogin',false);
    }

    onLabel(label) {
      if(operAnimType==1){//1为播种
        //实现铲土效果

      }else{
        //实现浇水效果
        this.createWaterAnimation()
      }
    }
    treeAnimation(){
      particle.plantParticle(this.treeAni);
      Laya.Tween.to(this.treeAni,{
        height:this.treeAni._height-20,
      }, 400,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
        Laya.Tween.to(this.treeAni,{
          height:this.treeAni._height+20,
        }, 300,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
          // this.gameUI.addTreeNode();
          Laya.Tween.to(this.treeAni,{
            height:this.treeAni._height-20,
          }, 200,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
            Laya.Tween.to(this.treeAni,{
              height:this.treeAni._height+20,
            }, 200,Laya.Ease.sineInOut,Laya.Handler.create(this,function(){
              this.gameUI.addTreeNode();
              setCookie('firstLogin',false);
              //更改背景图
      　　  },null,true));
    　　  },null,true));
  　　  },null,true));
　　  },null,true));
      
    }
}
