import Api from "../../common/Api";
import Bridge from '../../units/JSbridge.js'
import { report } from "../../units/statReport";
import { getCaption } from "../../units/units";

export default class helphavestCtrl extends Laya.Script{
    onAwake(){
      helphavestCtrl.I=this;
      this.owner.on(Laya.Event.MOUSE_DOWN,this,this.helphavest);
      this.havestImg=this.owner.getChildByName('havestImg');
      this.labtext=this.owner.getChildByName('labtext');
      this.messlist = [
        '下单得300金币'
      ];
      this.index  = 0;
    }
    init(data){
      this.messlist.push(data.content)
      this.havestImg.skin = data.imgUrl;
      this.linkUrl = data.linkUrl;
      setTimeout(() => {
        this.onpageshow()
      }, 2000);
      
    }
    //播放数据
    onpageshow() {
      //隔两秒切换
      Laya.timer.loop(2000,this,this.onLoop);  //loop方法定时循环执行
      
    }
    onLoop(){
      this.labtext.text = this.messlist[this.index];
      this.index = this.index+1;
      if(this.index==2){
        this.index=0;
      }
    }
    helphavest(linkUrl){
      Bridge.callHandler('getToken', '', (responseData)=>{
        if(!JSON.parse(responseData).token){
          Bridge.callHandler('gotoLogin', '', (responseData)=>{});
          console.log("成功")
        }else{
          getCaption(this.linkUrl)
          var params = {
            action_type:'点击',
            content:'助农增收',
            channel_name:'',
            content_id:'',
            content_cat:'',//矿工等级
            content_cat_id:'',//矿工数量
          }
          report(params);
        }
      });
    }
}