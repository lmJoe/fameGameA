import Api from "../common/Api";
import Data from "../common/Data";
import Scenes from "../common/Scenes";
import fameModule from "../scene/fameModule";
import homePages from "../scene/homePages";
import sound from "../units/sound";
import soundUrl from "../units/soundUrl";
import { formatSeconds } from "../units/units";

export default class cropMenu extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    
    onEnable() {
      this.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
      this.cropMenuBox.on(Laya.Event.MOUSE_DOWN,this,this.onMineBar);
      
      this.fieldId = this._param.fieldId;//土地id
      this.parentsHeight = this._parent._parent._height;
      this.cropMenuBoxHeight = this.cropMenuBox._height;
      this.getGrowCropsList();
      Laya.Tween.to(this.cropMenuBox,{
        x:0,
        y:this.parentsHeight-this.cropMenuBoxHeight,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
  
　　  },null,true));
    }
    getGrowCropsList(){
      Api.getGrowCropsList((response) => {
        console.log("菜园种植物列表列表",response);
        this.createCropsMenuList(response.data);
      });
    }
    createCropsMenuList(Arr){
      this.menuList.hScrollBarSkin = "";
      this.menuList.selectEnable = true;
      this.menuList.mouseHandler = new Laya.Handler(this, this.onSelect);
      this.menuList.renderHandler = new Laya.Handler(this, this.updateItem);
      this.menuList.array = Arr;
    }
    onSelect(e,i){
      if (e.type == Laya.Event.MOUSE_UP) {
        let data = e.currentTarget.dataSource;
        var obj;
        if(data.isLock==0){
          //如果当前土地的状态为1未种植，则种植后并更改状态值
          //如果当前土地的状态为2 已种植，则需要将未种植的土地id传递过去
          if(Data.landStatusArr[this.fieldId-1].status==1){
            Data.landStatusArr[this.fieldId-1].status = 2;
          }else if(Data.landStatusArr[this.fieldId-1].status == 2){
            //如果不相等，则从Data.landStatusArr找出一个status的值不为2的田地
            obj = Data.landStatusArr.find(o => o.status == 1);
            this.fieldId = obj.fieldId;
            Data.landStatusArr[obj.fieldId-1].status = 2;
          }
          
          Api.gameSeed(this.fieldId,data.cropsId, (response) => {
            console.log("播种结果",response);
            if(response.code==1){
              Data.seedFieldId = this.fieldId;
              let obj = Data.landStatusArr.find(o => o.status === 1);
              if(obj==undefined){
                this.closeBtnClick();
              }
              Data.cropMenuShow = true;
              homePages.I.getMainScene()
            }
          });
        }else{
          Laya.Dialog.open(Scenes.menu,true)
        }
        
      }
    }
    updateItem(cell,index){
      cell.getChildByName("cropImg").skin = cell.dataSource.imgUrl;
      cell.getChildByName("growSec").text = formatSeconds(cell.dataSource.growSec);
      Data.corpList.forEach(element => {
        if(element.name==cell.dataSource.name){
          cell.getChildByName("cropTitle").skin = element.imgurl;
        }
      });
      

    }
    closeBtnClick(){
      sound.playSound(soundUrl.playSoundClick,1);
      Laya.Tween.to(this.cropMenuBox,{
        x:0,
        y:this.parentsHeight+8,
      }, 300,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
        Laya.Dialog.close(Scenes.cropsMenu);
        fameModule.I.seedBtnShow(2)
　　  },null,true));
    }
    //点击菜单处禁止触发关闭
    onMineBar(e){
      e.stopPropagation();
    }
    onDisable() {
    }
}