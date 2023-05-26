import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
export default class fishOper extends Laya.Dialog {
    constructor() { 
        super(); 

    }
    
    onEnable() {
      this.okBtn.on(Laya.Event.MOUSE_DOWN,this,this.okBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
    }
    okBtnClick(){
      Laya.Dialog.close(Scenes.fishOper)
      gameControl.I.tillLandClick()
      
    }
    closeBtnClick(){
      Laya.Dialog.close(Scenes.fishOper)
    }
    onDisable() {
    }
}