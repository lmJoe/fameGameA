import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import gamebox from "../scene/gamebox";

export default class gamelogout extends Laya.Dialog {

    constructor() { 
        super(); 

    }
    
    onEnable() {
      this.btn1.on(Laya.Event.MOUSE_DOWN,this,this.btn1Click);
      this.btn2.on(Laya.Event.MOUSE_DOWN,this,this.btn2Click);
    }
    btn1Click(){
      Laya.Dialog.close(Scenes.gamelogout)
    }
    btn2Click(){
      Laya.Dialog.closeAll();
      gamebox.I.clearBoxContent();
      gameControl.I.getfameMsg();
    }
    onDisable() {
    }
}