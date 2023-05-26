import Api from "../common/Api";
import Data from "../common/Data";
import goldAni from "../common/goldAni";
import Scenes from "../common/Scenes";
import gameControl from "../game/gameControl";
import gamebox from "../scene/gamebox";
import {
  ajax
} from "../units/ajax";
import URL from "../units/url";

export default class collectmine extends Laya.Dialog {
  constructor() {
    super();
  }
  onAwake() {
    this.bigCoinTotal = this.bigContent.getChildByName("bigCoinTotal");
    this.bigNum = this.bigContent.getChildByName("bigNum");
    this.smallCoinTotal = this.smallContent.getChildByName("smallCoinTotal");
    this.smallNum = this.smallContent.getChildByName("smallNum");
    this.coinTotal = this.totalContent.getChildByName("coinTotal");
    var haveMineArr = Data.haveMineArr;
    this.arrayCnt(haveMineArr);
    this.coinTotal.text = Data.haveMineGold;
  }
  onEnable() {
    this.okBtn.on(Laya.Event.MOUSE_DOWN, this, this.okBtnClick);
  }
  okBtnClick() {
    let paramObj = {
      ids: Data.haveMineIdArr.length>0?Data.haveMineIdArr.join(","):'',
      coin: Data.haveMineGold,
    }
    Api.settlement(paramObj, (data) => {
      if (data.code == 1) {
        if(Data.haveMineGold!==0){
          goldAni.goldAniFuc(Data.haveMineGold);
        }
        setTimeout(() => {
          gamebox.I.clearBoxContent();
          Laya.Dialog.closeAll();
          gameControl.I.getfameMsg();
        }, 1500);
      }
    });
  }
  settlement() {
    ajax({
      type: 'POST',
      url: URL.settlement,
      data: {

      },
      dataType: 'json',
      // contentType:'application/json',
      success: (response) => {
        const mainData = response.data;
        if (response.code == 1) {
          console.log("结算", mainData)

        }
      },
      error: function (err) {
        Laya.Dialog.open(Scenes.Tip, true, {
          content: err
        });
      }
    })
  }
  arrayCnt(arr) {
    var newArr = [];
    var count = 0
    var count1 = 0;
    var goldNum = 0;
    var goldNum1 = 0;
    for (var i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i].coin) == -1) {
        newArr.push(arr[i])
      }
    }
    var newarr2 = new Array(newArr.length);
    for (var t = 0; t < newarr2.length; t++) {
      newarr2[t] = 0;
    }
    for (var p = 0; p < newArr.length; p++) {
      for (var j = 0; j < arr.length; j++) {
        if (newArr[p].coin == arr[j].coin) {
          newarr2[p]++;
        }
      }
    }
    for (var m = 0; m < newArr.length; m++) {
      if(newArr[m].coin == 500){
        count++;
        goldNum = newArr[m].coin;
      }else if(newArr[m].coin == 100){
        count1++;
        goldNum1 = newArr[m].coin;
      }
    }
    this.bigNum.text = 'X' + count;
    this.smallNum.text = 'X' + count1;
    this.bigCoinTotal.text = 'X' + count*goldNum;
    this.smallCoinTotal.text = 'X' + count1*goldNum1;
  }
  onDisable() {}
}