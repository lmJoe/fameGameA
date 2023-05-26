import Adapt_gamebox from "../common/Adapt_gamebox";
import Api from "../common/Api";
import Data from "../common/Data";
import Scenes from "../common/Scenes";
import {
  ajax
} from "../units/ajax";
import {
  createImage,
  removeDuplicateObj
} from "../units/units";
import URL from "../units/url";
export default class gamebox extends Laya.Script {
  constructor() {
    super();
    gamebox.I=this;
    /** @prop {name:drawerC1, tips:"第一个抽屉", type:Node, default:null}*/
    /** @prop {name:drawerC2, tips:"第二个抽屉", type:Node, default:null}*/
    /** @prop {name:drawerC3, tips:"第三个抽屉", type:Node, default:null}*/
    /** @prop {name:drawerC4, tips:"第四个抽屉", type:Node, default:null}*/
    /** @prop {name:addchange, tips:"增加次数", type:Node, default:null}*/
    /** @prop {name:chanceNum, tips:"次数", type:Node, default:null}*/
    /** @prop {name:boxlist, tips:"列表", type:Node, default:null}*/
    /** @prop {name:allbox, tips:"总框", type:Node, default:null}*/
    /** @prop {name:backBtn, tips:"返回按钮", type:Node, default:null}*/
    
    
    
    this.idArr = [];
    this.arr1 = [];
    this.arr2 = [];
    this.arr3 = [];
    this.arr4 = [];
    /**各个矿图的第一个位置 */
    this.arr1Index = '';
    this.arr2Index = '';
    this.arr3Index = '';
    this.arr4Index = '';
    /**存储当前点击单元格id */
    this.idArr1 = [];
    this.idArr2 = [];
    this.idArr3 = [];
    this.idArr4 = [];
    /**当前类型矿是否已获取标识 */
    this.identify1 = false;
    this.identify2 = false;
    this.identify3 = false;
    this.identify4 = false;
    /**四个矿的对象 */
    this.mineId1 = {};
    this.mineId2 = {};
    this.mineId3 = {};
    this.mineId4 = {};
    /**防连续点击 */
    this.preventClick = true;
  }
  onAwake() {
    //适配
    Adapt_gamebox.init(this.owner);
    this.getMainInfo();
  }
  onEnable() {
    
    this.addchange.on(Laya.Event.MOUSE_DOWN,this,this.addchangeClick);
    this.backBtn.on(Laya.Event.MOUSE_DOWN,this,this.backBtnClick);
    
    /**获取抽屉的位置 */
    // this.drawer1 = this.box2.getChildByName("drawer1");
    // this.drawer2 = this.box2.getChildByName("drawer2");
    // this.drawer3 = this.box2.getChildByName("drawer3");
    // this.drawer4 = this.box2.getChildByName("drawer4");
    // this.drawerC1 = this.drawer1.getChildByName("drawerC1");
    // this.drawerC2 = this.drawer2.getChildByName("drawerC2");
    // this.drawerC3 = this.drawer3.getChildByName("drawerC3");
    // this.drawerC4 = this.drawer4.getChildByName("drawerC4");

    Data.drawer1 = this.drawerC1.localToGlobal(new Laya.Point(0, 0));
    Data.drawer2 = this.drawerC2.localToGlobal(new Laya.Point(0, 0));
    Data.drawer3 = this.drawerC3.localToGlobal(new Laya.Point(0, 0));
    Data.drawer4 = this.drawerC4.localToGlobal(new Laya.Point(0, 0));
  }
  clearBoxContent(){
    // this.bigXYIMG1 = '';
    // this.smallXYIMG1 = '';
    // this.bigXYIMG2 = '';
    // this.smallXYIMG2 = '';
    // this.bigXYIMG3 = '';
    // this.smallXYIMG3 = '';
    // this.bigXYIMG4 = '';
    // this.smallXYIMG4 = '';
    this.drawerC1.skin = '';
    this.drawerC2.skin = '';
    this.drawerC3.skin = '';
    this.drawerC4.skin = '';
    Data.haveMineGold = 0;
    Data.haveMineIdArr = [];
    Data.haveMineArr = [];
    Data.gameChance = 0;
  }
  /**增加次数 */
  addchangeClick(){
    Laya.Dialog.open(Scenes.addchange,false);
  }
  onDisable() {}
  /**获取游戏数据 */
  getMainInfo() {
    Api.getMainInfo((response) => {
      var mainData = response.data;
      if (response.code == 1) {
        Data.gameChance = mainData.chance;
        this.gameChance()
        this.createList(mainData.items);
        console.log("抽卡次数",mainData);
      }
    });
    console.log("抽卡次数",Data.gameChance);
    // ajax({
    //   type: 'POST',
    //   url: URL.getMainInfo,
    //   data: {},
    //   dataType: 'json',
    //   // contentType:'application/json',
    //   success: (response) => {
    //     const mainData = response.data;
    //     if (response.code == 1) {
    //       console.log("mainData", mainData)
          
    //       this.gameChance()
    //       this.createList(mainData.items);
    //     }
    //   },
    //   error: function (err) {
    //     Laya.Dialog.open(Scenes.Tip, true, {
    //       content: err
    //     });
    //   }
    // })
  }
  createList(Arr) {
    // 使用但隐藏滚动条
    this.createListArr = Arr;
    this.disPose(() => {
      this.boxlist.selectEnable = true;
      this.boxlist.mouseHandler = new Laya.Handler(this, this.onSelect);
      this.boxlist.renderHandler = new Laya.Handler(this, this.updateItem);
      this.boxlist.array = Arr;
    });
  }
  updateItem(cell, index) {
    if (index == this.arr1Index) {
      let pointGlobal = this.boxlist.localToGlobal(new Laya.Point(0, 0), false);
      let pointFlyTo = this.boxlist.getCell(this.arr1Index).globalToLocal(pointGlobal, false);

      if (this.arr1.length == 4) {
        if (this.bigXYIMG1 == undefined) {
          this.bigXYIMG1 = createImage('bigXYIMG1', Math.abs(pointFlyTo.x) + 13, Math.abs(pointFlyTo.y) + 20, 156, 142, this.boxlist, true, cell.dataSource.imgUrl, -1);
          this.mineId1 = {
            name:'bigMine1',
            id:cell.dataSource.id,
          };
          console.log("1号位id",cell.dataSource.id)
        }
        
      } else {
        if (cell.dataSource.xValue == 2 && cell.dataSource.yValue == 1) {
          if (this.smallXYIMG1 == undefined) {
            this.smallXYIMG1 = createImage('smallXYIMG1', Math.abs(pointFlyTo.x) + 18, Math.abs(pointFlyTo.y) + 6, 155, 82, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId1 = {
              name:'smallMine1-2-1',
              id:cell.dataSource.id,
            };
            console.log("1号位id",cell.dataSource.id)
          }
          
        } else if (cell.dataSource.xValue == 1 && cell.dataSource.yValue == 2) {
          if (this.smallXYIMG1 == undefined) {
            this.smallXYIMG1 = createImage('smallXYIMG1', Math.abs(pointFlyTo.x) + 6, Math.abs(pointFlyTo.y) + 18, 82, 155, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId1 = {
              name:'smallMine1-1-2',
              id:cell.dataSource.id,
            };
            console.log("1号位id",cell.dataSource.id)
          }
        }
      }
    } else if (index == this.arr2Index) {
      let pointGlobal = this.boxlist.localToGlobal(new Laya.Point(0, 0), false);
      let pointFlyTo = this.boxlist.getCell(this.arr2Index).globalToLocal(pointGlobal, false);
      if (this.arr2.length == 4) {
        if (this.bigXYIMG2 == undefined) {
          this.bigXYIMG2 = createImage('bigXYIMG2', Math.abs(pointFlyTo.x) + 13, Math.abs(pointFlyTo.y) + 20, 156, 142, this.boxlist, true, cell.dataSource.imgUrl, -1);
          this.mineId2 = {
            name:'bigMine2',
            id:cell.dataSource.id,
          };
          console.log("2号位id",cell.dataSource.id)
        }
        
      } else {
        if (cell.dataSource.xValue == 2 && cell.dataSource.yValue == 1) {
          if (this.smallXYIMG2 == undefined) {
            this.smallXYIMG2 = createImage('smallXYIMG2', Math.abs(pointFlyTo.x) + 18, Math.abs(pointFlyTo.y) + 6, 155, 82, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId2 = {
              name:'smallMine2-2-1',
              id:cell.dataSource.id,
            };
            console.log("2号位id",cell.dataSource.id)
          }
          
        } else if (cell.dataSource.xValue == 1 && cell.dataSource.yValue == 2) {
          if (this.smallXYIMG2 == undefined) {
            this.smallXYIMG2 = createImage('smallXYIMG2', Math.abs(pointFlyTo.x) + 6, Math.abs(pointFlyTo.y) + 18, 82, 155, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId2 = {
              name:'smallMine2-1-2',
              id:cell.dataSource.id,
            };
            console.log("2号位id",cell.dataSource.id)
          }
        }
      }
    } else if (index == this.arr3Index) {
      let pointGlobal = this.boxlist.localToGlobal(new Laya.Point(0, 0), false);
      let pointFlyTo = this.boxlist.getCell(this.arr3Index).globalToLocal(pointGlobal, false);
      if (this.arr3.length == 4) {
        if (this.bigXYIMG3 == undefined) {
          this.bigXYIMG3 = createImage('bigXYIMG3', Math.abs(pointFlyTo.x) + 13, Math.abs(pointFlyTo.y) + 20, 82, 155, this.boxlist, true, cell.dataSource.imgUrl, -1);
          this.mineId3 = {
            name:'bigMine3',
            id:cell.dataSource.id,
          };
          console.log("3号位id",cell.dataSource.id)
        }
        
      } else {
        if (cell.dataSource.xValue == 2 && cell.dataSource.yValue == 1) {
          if (this.smallXYIMG3 == undefined) {
            this.smallXYIMG3 = createImage('smallXYIMG3', Math.abs(pointFlyTo.x) + 18, Math.abs(pointFlyTo.y) + 6, 155, 82, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId3 = {
              name:'smallMine3-2-1',
              id:cell.dataSource.id,
            };
            console.log("3号位id",cell.dataSource.id)
          }
          
        } else if (cell.dataSource.xValue == 1 && cell.dataSource.yValue == 2) {
          if (this.smallXYIMG3 == undefined) {
            this.smallXYIMG3 = createImage('smallXYIMG3', Math.abs(pointFlyTo.x) + 6, Math.abs(pointFlyTo.y) + 18, 82, 155, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId3 = {
              name:'smallMine3-1-2',
              id:cell.dataSource.id,
            };
            console.log("3号位id",cell.dataSource.id)
          }
          
        }

      }
    } else if (index == this.arr4Index) {
      let pointGlobal = this.boxlist.localToGlobal(new Laya.Point(0, 0), false);
      let pointFlyTo = this.boxlist.getCell(this.arr4Index).globalToLocal(pointGlobal, false);
      if (this.arr4.length == 4) {
        if (this.bigXYIMG4 == undefined) {
          this.bigXYIMG4 = createImage('bigXYIMG4', Math.abs(pointFlyTo.x) + 13, Math.abs(pointFlyTo.y) + 20, 156, 142, this.boxlist, true, cell.dataSource.imgUrl, -1);
          this.mineId4 = {
            name:'bigMine4',
            id:cell.dataSource.id,
          };
          console.log("4号位id",cell.dataSource.id)
        }
        
      } else {
        if (cell.dataSource.xValue == 2 && cell.dataSource.yValue == 1) {
          if (this.smallXYIMG4 == undefined) {
            this.smallXYIMG4 = createImage('smallXYIMG4', Math.abs(pointFlyTo.x) + 18, Math.abs(pointFlyTo.y) + 6, 155, 82, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId4 = {
              name:'smallMine4-2-1',
              id:cell.dataSource.id,
            };
            console.log("4号位id",cell.dataSource.id)
          }
          
        } else if (cell.dataSource.xValue == 1 && cell.dataSource.yValue == 2) {
          if (this.smallXYIMG4 == undefined) {
            this.smallXYIMG4 = createImage('smallXYIMG4', Math.abs(pointFlyTo.x) + 6, Math.abs(pointFlyTo.y) + 18, 82, 155, this.boxlist, true, cell.dataSource.imgUrl, -1);
            this.mineId4 = {
              name:'smallMine4-1-2',
              id:cell.dataSource.id,
            };
            console.log("4号位id",cell.dataSource.id)
          }
          
        }
      }
    }
  }
  onSelect(e, i) {
    if (e.type == Laya.Event.MOUSE_UP&&e.target.name == 'bg1') {
      if(Data.gameChance>0&&this.preventClick==true){
        var cellCurrent = this.boxlist.getCell(i); //获取当前点击的节点
        var dataSource = this.boxlist.getCell(i)._dataSource;
        cellCurrent.getChildByName("bg1").visible = false;
        Data.gameChance = Data.gameChance-1;
        this.gameChance();
        //创建一个图片box
        /**判断当前点击框x和y的积是否为4，则 */
        if (dataSource.xValue * dataSource.yValue == 4) {
          if (this.idArr1.length == 0 && !this.identify1) {
            this.idArr1.push(dataSource.id)
          } else if (this.idArr1.length < 4 && this.idArr1.includes(dataSource.id)) {
            this.idArr1.push(dataSource.id)
          } else if (this.idArr2.length == 0 && !this.identify2) {
            this.idArr2.push(dataSource.id)
          } else if (this.idArr2.length < 4 && this.idArr2.includes(dataSource.id)) {
            this.idArr2.push(dataSource.id)
          }
        } else {
          if (dataSource.xValue == 2 && dataSource.yValue == 1) {
            if (this.idArr3.length == 0 && !this.identify3) {
              this.idArr3.push(dataSource.id)
            } else if (this.idArr3.length < 2 && this.idArr3.includes(dataSource.id)) {
              this.idArr3.push(dataSource.id)
            }
          } else if (dataSource.xValue == 1 && dataSource.yValue == 2) {
            if (this.idArr4.length == 0 && !this.identify4) {
              this.idArr4.push(dataSource.id)
            } else if (this.idArr4.length < 2 && this.idArr4.includes(dataSource.id)) {
              this.idArr4.push(dataSource.id)
            }
          }
        }
        if (this.idArr1.length == 4 || this.idArr2.length == 4 || this.idArr3.length == 2 || this.idArr4.length == 2) {
          this.preventClick = false;
          setTimeout(() => {
            this.preventClick = true;
          }, 1500);
          if (this.idArr1.length == 4) {
            if((this.mineId1.id == dataSource.id)&&(this.mineId1.name =='bigMine1')){
              this.movingTra(this.bigXYIMG1,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId2.id == dataSource.id)&&(this.mineId2.name =='bigMine2')){
              this.movingTra(this.bigXYIMG2,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId3.id == dataSource.id)&&(this.mineId3.name =='bigMine3')){
              this.movingTra(this.bigXYIMG3,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId4.id == dataSource.id)&&(this.mineId4.name =='bigMine4')){
              this.movingTra(this.bigXYIMG4,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }
            this.idArr1 = [];
            this.identify1 = true;
          } else if (this.idArr2.length == 4) {
            if((this.mineId1.id == dataSource.id)&&(this.mineId1.name =='bigMine1')){
              this.movingTra(this.bigXYIMG1,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId2.id == dataSource.id)&&(this.mineId2.name =='bigMine2')){
              this.movingTra(this.bigXYIMG2,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId3.id == dataSource.id)&&(this.mineId3.name =='bigMine3')){
              this.movingTra(this.bigXYIMG3,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId4.id == dataSource.id)&&(this.mineId4.name =='bigMine4')){
              this.movingTra(this.bigXYIMG4,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }
            this.idArr2 = [];
            this.identify2 = true;
          } else if (this.idArr3.length == 2) {
            if((this.mineId1.id == dataSource.id)&&(this.mineId1.name =='smallMine1-2-1')){
              this.movingTra(this.smallXYIMG1,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId2.id == dataSource.id)&&(this.mineId2.name =='smallMine2-2-1')){
              this.movingTra(this.smallXYIMG2,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId3.id == dataSource.id)&&(this.mineId3.name =='smallMine3-2-1')){
              this.movingTra(this.smallXYIMG3,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId4.id == dataSource.id)&&(this.mineId4.name =='smallMine4-2-1')){
              this.movingTra(this.smallXYIMG4,dataSource.imgUrl,dataSource.id,dataSource.coin)
            } 
            // this.movingTra(boxImg,dataSource.imgUrl)
            this.idArr3 = [];
            this.identify3 = true;
          } else if (this.idArr4.length == 2) {
            if((this.mineId1.id == dataSource.id)&&(this.mineId1.name =='smallMine1-1-2')){
              this.movingTra(this.smallXYIMG1,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId2.id == dataSource.id)&&(this.mineId2.name =='smallMine2-1-2')){
              this.movingTra(this.smallXYIMG2,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId3.id == dataSource.id)&&(this.mineId3.name =='smallMine3-1-2')){
              this.movingTra(this.smallXYIMG3,dataSource.imgUrl,dataSource.id,dataSource.coin)
            }else if((this.mineId4.id == dataSource.id)&&(this.mineId4.name =='smallMine4-1-2')){
              this.movingTra(this.smallXYIMG4,dataSource.imgUrl,dataSource.id,dataSource.coin);
            }
            this.idArr4 = [];
            this.identify4 = true;
          }
        }
      }
    }
  }
  movingTra(boxImg,imgUrl,id,coin) {
    var boxImgPoint = boxImg.localToGlobal(new Laya.Point(0, 0), false);
    var yValue,xValue;
    if (this.drawerC1.skin == undefined || this.drawerC1.skin == '') {
      let pointFlyTo = this.drawerC1.globalToLocal(boxImgPoint, false);
      yValue = Math.abs(pointFlyTo.y)+boxImg._y;
      xValue = Data.drawer1.x;
    }else if (this.drawerC2.skin == undefined || this.drawerC2.skin == '') {
      let pointFlyTo = this.drawerC2.globalToLocal(boxImgPoint, false);
      yValue = Math.abs(pointFlyTo.y)+boxImg._y;
      xValue = Data.drawer2.x;
    }else if(this.drawerC3.skin == undefined || this.drawerC3.skin == ''){
      let pointFlyTo = this.drawerC3.globalToLocal(boxImgPoint, false);
      yValue = Math.abs(pointFlyTo.y)+boxImg._y;
      xValue = Data.drawer3.x;
    }else if (this.drawerC4.skin == undefined || this.drawerC4.skin == '') {
      let pointFlyTo = this.drawerC4.globalToLocal(boxImgPoint, false);
      yValue = Math.abs(pointFlyTo.y)+boxImg._y;
      xValue = Data.drawer4.x;
    }
    Laya.Tween.to(boxImg, {
      scaleX: boxImg.scaleX * 1.12,
      scaleY: boxImg.scaleY * 1.12,
      zOrder:4,
    }, 500, Laya.Ease.linearOut, Laya.Handler.create(this, function () {
      console.log("yValue",yValue)
      Laya.Tween.to(boxImg, {
        x: xValue,
        y: yValue,
        scaleX: boxImg.scaleX*0.5,
        scaleY: boxImg.scaleY*0.5,
      }, 800, Laya.Ease.linearOut, Laya.Handler.create(this, function () {        
        boxImg.removeSelf();
        //轨迹运行完成后，做相应的操作
        if (this.drawerC1.skin == undefined || this.drawerC1.skin == '') {
          this.drawerC1.size(boxImg.width*(1/2), boxImg.height*(1/2));
          this.drawerC1.skin = imgUrl;
          this.drawerC1.centerX=0;
          this.drawerC1.centerY=0;
          /**先变大，然后下移并逐渐变小 */
          let obj = {
            coin:coin,
            id:id,
          }
          Data.haveMineArr.push(obj);
        }else if (this.drawerC2.skin == undefined || this.drawerC2.skin == '') {
          this.drawerC2.size(boxImg.width*(1/2), boxImg.height*(1/2));
          this.drawerC2.skin = imgUrl;
          this.drawerC2.centerX=0;
          this.drawerC2.centerY=0;
          /**先变大，然后下移并逐渐变小 */
          let obj = {
            coin:coin,
            id:id,
          }
          Data.haveMineArr.push(obj);
        }else if(this.drawerC3.skin == undefined || this.drawerC3.skin == ''){
          this.drawerC3.size(boxImg.width*(1/2), boxImg.height*(1/2));
          this.drawerC3.skin = imgUrl;
          this.drawerC3.centerX=0;
          this.drawerC3.centerY=0;
          /**先变大，然后下移并逐渐变小 */
          let obj = {
            coin:coin,
            id:id,
          }
          Data.haveMineArr.push(obj);
        }else if (this.drawerC4.skin == undefined || this.drawerC4.skin == '') {
          this.drawerC4.size(boxImg.width*(1/2), boxImg.height*(1/2));
          this.drawerC4.skin = imgUrl;
          this.drawerC4.centerX=0;
          this.drawerC4.centerY=0;
          /**先变大，然后下移并逐渐变小 */
          let obj = {
            coin:coin,
            id:id,
          }
          Data.haveMineArr.push(obj);
          this.calculateFun();
          
        }
        
        
      }, null, true));
    }, null, true));
  }
  /**返回 */
  backBtnClick(){
    Laya.Dialog.open(Scenes.gamelogout,false);
  }
  /**处理数组 */
  disPose(callback) {
    /**数组去重 */
    const newBoxArr = removeDuplicateObj(this.createListArr)
    for (let i = 0; i < newBoxArr.length; i++) {
      if (newBoxArr[i].id !== 0) {
        this.idArr.push(newBoxArr[i].id);
      }
    }
    for (let i = 0; i < this.createListArr.length; i++) {
      if (this.createListArr[i].id == 1) {
        this.createListArr[i].index = i;
        this.arr1.push(this.createListArr[i]);
      } else if (this.createListArr[i].id == 2) {
        this.createListArr[i].index = i;
        this.arr2.push(this.createListArr[i]);
      } else if (this.createListArr[i].id == 3) {
        this.createListArr[i].index = i;
        this.arr3.push(this.createListArr[i]);
      } else if (this.createListArr[i].id == 4) {
        this.createListArr[i].index = i;
        this.arr4.push(this.createListArr[i]);
      }
    }
    this.arr1Index = this.arr1[0].index;
    this.arr2Index = this.arr2[0].index;
    this.arr3Index = this.arr3[0].index;
    this.arr4Index = this.arr4[0].index;
    callback();
  }
  /**次数调整 */
  gameChance(){
    //并且计算当前矿是否已经挖完
    if(Data.gameChance<10){
      this.chanceNum.text = '0'+Data.gameChance;
    }else{
      this.chanceNum.text = Data.gameChance;
    }
    if(Data.gameChance==0){
      setTimeout(() => {
        this.calculateFun();
      }, 1600);
      
    }
  }
  calculateFun(){
    /**计算金币 */
      for(let i=0;i<Data.haveMineArr.length;i++){
        Data.haveMineIdArr.push(Data.haveMineArr[i].id);
        Data.haveMineGold = Data.haveMineGold + Data.haveMineArr[i].coin;
      }
      if(Data.haveMineGold==0){
        Data.haveMineArr = 0;
        Data.haveMineIdArr = [];
      }
      console.log("总金币",Data.haveMineGold,Data.haveMineIdArr);
      this.dialog = Laya.Dialog.open(Scenes.collectmine,false);
    
  }
}