import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import gamebox from "../scene/gamebox";
export default class noGold extends Laya.Dialog {
    constructor() { 
        super(); 

    }
    
    onEnable() {
      this.okBtn.on(Laya.Event.MOUSE_DOWN,this,this.okBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
    }
    okBtnClick(){
      Laya.Dialog.close(Scenes.noGold)
      gameControl.I.tillLandClick()
    }
    closeBtnClick(){
      Laya.Dialog.close(Scenes.noGold)
    }
    onDisable() {
    }
}