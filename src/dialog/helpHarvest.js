export default class helpHarvest extends Laya.Dialog {
    constructor() { 
      super(); 
    }
    
    onEnable() {
      // this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeClick);
      this.divHtml = this._param.content;
    }

    onDisable() {
    }
}