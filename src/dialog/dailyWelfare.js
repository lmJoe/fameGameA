import Api from "../common/Api";
import Data from "../common/Data";
import goldAni from "../common/goldAni";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import Ad from "../units/Ad";

export default class dailyWelfare extends Laya.Dialog {
    constructor() { 
        super(); 
    }
    onEnable() {
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.clickBtnClick);
      this.seeAd.on(Laya.Event.MOUSE_DOWN,this,this.seeAdClick);
      this.surplus.text='今日剩余次数：'+Data.wrateingLeaveNum+'次';
    }
    clickBtnClick(){
      Laya.Dialog.close(Scenes.dailyWelfare);
    }
    seeAdClick(){
      Ad.addAd((data)=>{
        //isSuccess为1调取成功
        if(JSON.parse(data).isSuccess==1){
          Api.earnHidePrize(Data.wateringreasonId,1,(data)=>{
            console.log("广告成功领取奖励",data);
            Data.wrateingLeaveNum = Data.wrateingLeaveNum-1;
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
      Laya.Dialog.close(Scenes.dailyWelfare);
    }
}