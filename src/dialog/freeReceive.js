import Scenes from "../common/Scenes";

export default class freeReceive extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    onEnable() {
      this.close.on(Laya.Event.MOUSE_DOWN,this,this.clickBtnClick);
    }
    clickBtnClick(){
      Laya.Dialog.close(Scenes.freeReceive);
    }
}