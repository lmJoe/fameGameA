import Api from "../common/Api";
import Data from "../common/Data";
import Scenes from "../common/Scenes";
import gamebox from "../scene/gamebox";
import { ajax } from "../units/ajax";
import URL from "../units/url";

export default class addchange extends Laya.Dialog {

    constructor() { 
      
      super(); 
    }
    
    onEnable() {
      this.okBtn.on(Laya.Event.MOUSE_DOWN,this,this.okBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      if(Data.jewel<5){
        this.okBtn.skin = 'drawcard/p16-1.png';
      }else{
        this.okBtn.skin = 'drawcard/p16.png';
      }
    }
    closeBtnClick() {
      Laya.Scene.close(Scenes.addchange);
    }
    okBtnClick(){
      if(Data.jewel<5){
        Laya.Dialog.open(Scenes.Tip, false, {
          content: '钻石不足'
        });
      }else{
        Api.gameAddChance((data)=>{
          if(data.code==1){
            Data.gameChance = Data.gameChance+data.data;
            gamebox.I.gameChance()
            // Laya.Dialog.open(Scenes.Tip, true, {
            //   content: data.msg
            // });
            Laya.Dialog.close(Scenes.addchange)
          }
        });
      }
    }
    onDisable() {
    }
}