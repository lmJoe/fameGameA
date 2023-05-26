import Api from "../common/Api";
import Data from "../common/Data";
import Scenes from "../common/Scenes";
import homePages from "../scene/homePages";
import sound from "../units/sound";
import soundUrl from "../units/soundUrl";

export default class menu extends Laya.Dialog {
    constructor() { 
        super(); 
    }
    
    onEnable() {
      sound.playSound(soundUrl.diggleSound,1)
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.getGardenCropsList();
    }
    /**播种 */
    getGardenCropsList(){
      Api.getGardenCropsList((response) => {
        console.log("菜园列表",response);
        this.createMenuList(response.data);
      });
    }
    createMenuList(Arr){
      // 使用但隐藏滚动条
      this.menuList.vScrollBarSkin = "";
      this.menuList.selectEnable = true;
      this.menuList.mouseHandler = new Laya.Handler(this, this.onSelect);
      this.menuList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.menuList.array = Arr;
    }
    onSelect(e,i){
      if (e.type == Laya.Event.MOUSE_DOWN) {
        sound.playSound(soundUrl.playSoundClick,1);
        if(e.currentTarget.dataSource.isLock==1){
          let cropsId = e.currentTarget.dataSource.cropsId;
          let bill = e.currentTarget.dataSource.bill;
          Api.unlockCrops(cropsId,(response) => {
            console.log("解锁",response);
            if(response.code==1){
              Laya.Dialog.open(Scenes.Tip, true, {
                content: '解锁成功'
              });
              e.target.getChildByName("cropBg").visible = false;
              Data.bill = Data.bill - bill;
              homePages.I.upDatatillBill();
              
            }else{
              Laya.Dialog.open(Scenes.Tip, false, {
                content: response.msg
              });
            }
          });
        }
      }
    }
    updateItem(cell,index){
      cell.getChildByName("cropImg").skin = cell.dataSource.imgUrl;
      Data.corpList.forEach(element => {
        if(element.name==cell.dataSource.name){
          cell.getChildByName("cropTitle").skin = element.imgurl;
        }
      });
      switch (cell.dataSource.isLock) {
        case 0:
          cell.getChildByName("cropBoolean").visible = true;
          cell.getChildByName("cropBg").visible = false;
          cell.getChildByName("cropBg").getChildByName("cropMoney").text = cell.dataSource.bill;
          break;
        case 1:
          cell.getChildByName("cropBoolean").visible = false;
          cell.getChildByName("cropBg").visible = true;
          cell.getChildByName("cropBg").getChildByName("cropMoney").text = cell.dataSource.bill;
          break;
      }
    }
    closeBtnClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Laya.Dialog.close(Scenes.menu);
    }
    onDisable() {
    }
}