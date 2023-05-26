import Data from "../common/Data";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";

export default class landUpgrade extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.shureBtn.on(Laya.Event.MOUSE_DOWN,this,this.shureBtnClick);
      var famelandMsg = this._param.data;
      this.userEventLevel_af = famelandMsg.userEvent.userEventLevel_af;
      this.userEventLevel_bf = famelandMsg.userEvent.userEventLevel_bf;
      this.userItemInfos = famelandMsg.userEvent.userItemInfos;
      Laya.timer.frameLoop(1, this, function(){
        this.rightBox.getChildByName("rightRotating").rotation += 2;
      });
      this.createLandUpgrade();
    }

    onDisable() {
    }
    createLandUpgrade(){
      //奖励金币数
      let ValueArr = [
        {
          imgNode:this.leftAwardImg,
          valueNode:this.leftgoldNum,
        },
        {
          imgNode:this.rightAwardImg,
          valueNode:this.rightgoldNum,
        },
      ];
      //itemtype 0金币 6钻石 1水桶
      console.log("this.userItemInfos",this.userItemInfos);
      let userItemInfos = this.userItemInfos;
      if(userItemInfos.length>0){
        if(userItemInfos.length==1){
          this.leftBg.visible = true;
          this.leftAwardImg.visible = true;
          this.leftgoldNum.visible = true;
        }else if(userItemInfos.length==2){
          this.leftBg.visible = true;
          this.leftAwardImg.visible = true;
          this.leftgoldNum.visible = true;
          this.rightBg.visible = true;
          this.rightAwardImg.visible = true;
          this.rightgoldNum.visible = true;
        }
      }
      for(var j in userItemInfos){
        if(userItemInfos[j].itemtype==0){
          ValueArr[j].imgNode.skin = 'comp/gold.png';
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          Data.coin+=Number(userItemInfos[j].number);
          gameControl.I.updateCoin();
        }else if(userItemInfos[j].itemtype==1){
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          // Data.jewel+=Number(userItemInfos[j].number);
          // gameControl.I.updateJewel();
          if (userItemInfos[j].itemid == 2001) {
            ValueArr[j].imgNode.skin = 'comp/icon6.png';
          } else if (userItemInfos[j].itemid == 2002) {
            ValueArr[j].imgNode.skin = 'comp/icon12.png';
          } else if (userItemInfos[j].itemid == 2003) {
            ValueArr[j].imgNode.skin = 'comp/icon13.png';
          } else if (userItemInfos[j].itemid == 2004) {
            ValueArr[j].imgNode.skin = 'comp/icon14.png';
          } else if (userItemInfos[j].itemid == 2005) {
            ValueArr[j].imgNode.skin = 'comp/icon15.png';
          }
        }else if(userItemInfos[j].itemtype==6){
          ValueArr[j].imgNode.skin = 'backpack/icon2.png';
          ValueArr[j].valueNode.label = userItemInfos[j].number;
          // Data.jewel+=Number(userItemInfos[j].number);
          // gameControl.I.updateJewel();
        }
        
      }
      //前土地效率
      this.leftBox.getChildByName("Aefficiency").text = '土地效率×'+this.userEventLevel_bf.buffer;
      //后土地效率
      this.rightBox.getChildByName("Befficiency").text = '土地效率×'+this.userEventLevel_af.buffer;
      //前土地等级
      this.leftBox.getChildByName("ALevel").text = this.userEventLevel_bf.Level;
      //后土地等级
      this.rightBox.getChildByName("BLevel").text = this.userEventLevel_af.Level;

      var landImgArr = [
        {img:'land/farmland1.png',level:1},
        {img:'land/farmland2.png',level:2},
        {img:'land/farmland3.png',level:3},
        {img:'land/farmland4.png',level:4},
        {img:'land/farmland5.png',level:5},
        {img:'land/farmland6.png',level:6},
        {img:'land/farmland7.png',level:7},
        {img:'land/farmland8.png',level:8},
        {img:'land/farmland9.png',level:9},
        {img:'land/farmland10.png',level:10},
        {img:'land/farmland11.png',level:11},
        {img:'land/farmland12.png',level:12},
        {img:'land/farmland13.png',level:13},
        {img:'land/farmland14.png',level:14},
        {img:'land/farmland15.png',level:15},
        {img:'land/farmland16.png',level:16},
        {img:'land/farmland17.png',level:17},
        {img:'land/farmland18.png',level:18},
        {img:'land/farmland19.png',level:19},
        {img:'land/farmland20.png',level:20},
      ]
      var ALevelimg,BLevelimg;
      for(var i=0;i<landImgArr.length;i++){
        if(this.userEventLevel_bf.Level==landImgArr[i].level){
          ALevelimg = landImgArr[i].img;
        }
        if(this.userEventLevel_af.Level==landImgArr[i].level){
          BLevelimg = landImgArr[i].img;
        }
      }
      //前土地等级图片
      this.leftBox.getChildByName("ALevelimg").skin = ALevelimg;
      //后土地等级图片
      this.rightBox.getChildByName("BLevelimg").skin = BLevelimg;
    }
    shureBtnClick(){
      Laya.Dialog.close(Scenes.landUpgrade);
    }
}