import Api from '../common/Api.js';
import Data from '../common/Data.js';
import Scenes from '../common/Scenes.js';
import Bridge from './JSbridge.js'
export default new class JointFun{
  /**热气球广告增加 */
  addAd(callback){
    Bridge.callHandler('loadRewardAd', '', (responseData)=>{
      callback && callback(responseData);  
    });
  }
  /**广告数据参数配置
 * balloonTime 热气球出现频率时间
 */
  configAdData(gameAnimation){
    Api.getAdData((response) => {
      var mainData = response.data;
      if (response.code == 1) {
        //获取热气球时间数值
        console.log("广告数据",response)
        mainData.forEach(element => {
          if(JSON.parse(element.ext).ac=='balloon'){
            if(element.leaveNum!==0){
              Data.balloonTime = JSON.parse(element.ext).staySec;
              this.balloonTime = JSON.parse(element.ext).staySec;
              Data.ballADreasonId = element.reasonId;
              // Data.balloonTime = 20*1000;
              //根据获取的时间对热气球频率并显示热气球
              gameAnimation.createAnimation();
              Laya.timer.once(this.balloonTime+20,this,()=>{
                this.hotballoonTimer(gameAnimation)
              })
            }
          }else if(JSON.parse(element.ext).ac=='wateringok'){
            Data.wateringreasonId = element.reasonId;
            Data.wrateingLeaveNum = element.leaveNum;
          }else if(JSON.parse(element.ext).ac=='nocoinwatering'){
            Data.nocoinreasonId = element.reasonId;
          }
        });
        
        
      }
    });
  }
  /**热气球定时器 */
  hotballoonTimer(gameAnimation){
    let hotbalTimer = setInterval(() => {
      if(Data.boolean==true){
        Data.balloonTime--;
        if(Data.balloonTime==0){
          gameAnimation.createAnimation();
          Data.balloonTime=this.balloonTime+20;
        }
      }else{
        clearInterval(hotbalTimer);
      }
    }, 1000);
  }
  //浇水
  wateringAddAD(){
    console.log("浇水广告id",Data.wateringreasonId);
    Api.uploadHideEvent(Data.wateringreasonId,(data)=>{
      console.log("浇水添加结果",data);
        if(data.data.popup == 'lookad'){
          Laya.Dialog.open(Scenes.dailyWelfare, false);
        }
    })
  }
}