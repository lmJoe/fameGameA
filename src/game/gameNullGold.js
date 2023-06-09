import sound from "../units/sound.js";
import soundUrl from "../units/soundUrl.js";
export default class gameNullGold extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:goToAd, tips:"去看视频", type:Node, default:null}*/
        let goToAd = true;
        /** @prop {name:closeBtn, tips:"关闭", type:Node, default:null}*/
        let closeBtn = true;
    }
    onStart(){
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.goToAd.on(Laya.Event.MOUSE_DOWN,this,this.goToAdClick);
    }
    onEnable() {
    }

    onDisable() {
    }
    closeBtnClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      this.owner.parent.removeChild(this.owner);
    }
    goToAdClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      //跳转到视频页看视频

      
    }
}