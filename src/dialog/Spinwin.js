import gameControl from "../game/gameControl.js";
import Scenes from "../common/Scenes.js"
import { ajax } from "../units/ajax.js";
import URL from "../units/url.js";
import { createImageRotation, createLabelRotation, getCaption, textSize } from "../units/units.js";
import goldAni from "../common/goldAni.js";
import Adapt from "../common/Adapt.js";
import Data from "../common/Data.js";
import { report } from "../units/statReport.js";
import sound from "../units/sound.js";
import soundUrl from "../units/soundUrl.js";
let dwidth;//免费次数文字宽度
let wheelFish=false;//免费次数用完则需要刷新转盘
export default class Spinwin extends Laya.Dialog{
  constructor(){
		super();
	}

  onEnable(){
    this.adapt();
    this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
    this.getInfoAndList();
    this.getStatusInfo();
    this.clickBtn.on(Laya.Event.MOUSE_DOWN,this,this.clickBtnClick);
    this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.closeBtnClick);
    this.spinList.on(Laya.Event.MOUSE_DOWN,this,this.spinListClick);
    this.freeNum = this.freeGameNum.getChildByName('freeNum');
    this.rightText = this.freeGameNum.getChildByName('rightText');
    this.currentTurnTableSkinIndex=0;
    this.clickBtn.visible=false;
  }

  adapt(){
    let ratio=Adapt.ratio;
    if(ratio<1){
      ratio+=0.1;
      this.spinBox.scale(ratio, ratio);
    }
  }

  /**点击抽奖 */
  clickBtnClick(){
    /**调用gameControl文件中的getfameMsg方法 */
    this.getlottery()
    var params = {
      action_type:'点击',
      content:'大转盘-开始',
      channel_name:'大转盘',
      content_id:'',
      content_cat:'',//矿工等级
      content_cat_id:'',//矿工数量
    }
    report(params);  
  }
  /**关闭当前弹窗 */
  closeBtnClick(){
    Laya.Dialog.close(Scenes.Spinwin);
    // this.close();
    var params = {
      action_type:'点击',
      content:'大转盘-关闭',
      channel_name:'大转盘',
      content_id:'',
      content_cat:'',//矿工等级
      content_cat_id:'',//矿工数量
    }
    report(params);  
    dwidth = undefined;
  }
  /**抽奖记录跳转 */
  spinListClick(){
    // Laya.Dialog.open(Scenes.drawrecord)
    Laya.Dialog.open(Scenes.drawrecord,false)
  }
  /**底盘图片资源更换 */
  changeImg(){
    this.currentTurnTableSkinIndex=!this.currentTurnTableSkinIndex;
    this.spinWinBox.skin = this.turnTableSkins[Number(this.currentTurnTableSkinIndex)];
  }
  /**获取抽奖列表 */
  getInfoAndList(){
      ajax({
        type: 'POST',
        url: URL.getInfoAndList,
        data:{},
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            console.log("转盘列表",res);
            var prizestable = res.data.list;
            this.prizestable = res.data.list;
            var imagestr = res.data.imgUrl;
            this.wheelId = res.data.id;
            //var imagearr = imagestr.split(",");
            //this.turnTableSkins=[imagearr[0], imagearr[1]];
            /**转盘资源更换 */
            Laya.timer.frameLoop(30,this,this.changeImg);
            let colorsMap=[
              ['#EE8A2B', '#FAB840'],
              ['#EDF7FF', '#FEF7F5'],
              ['#FFF1AF', '#FFFBDE'],
            ];
            let lblColorsMap=['#FFFFFF', '#656B70', '#926741'];
            let names=['木头', '白银', '黄金'];
            let index=names.indexOf(res.data.name);
            let colors=colorsMap[index], lblColor=lblColorsMap[index];
            this.turnTableSkins=['spinwin/wheel'+index+'.png', 'spinwin/wheel'+index+'-2.png'];
            this.spinWinBox.skin =this.turnTableSkins[0];
            this.imgPointer.skin='spinwin/pointer'+index+'.png';
            this.imgTitle.skin='spinwin/title'+index+'.png';
            this.clickBtn.visible=true;
            let lineW=index==0?0:1;
            let lineColors=['#000','#aab6bf','#e9c068'];
            let lineColor=lineColors[index];
            /**创建一个奖品实例 */
            var startRotation = -90;
            for(var i=0;i<prizestable.length;i++){
              /**根据当前奖品数量计算每个奖品的角度 */
              var color=colors[i%2];
              var spinRotation = 360/prizestable.length;
              this.spinRotation=spinRotation;
              let box=new Laya.Box();
              box.rotation=Number(spinRotation*(i+1)-spinRotation/2);
              box.anchorX=0.5;
              box.anchorY=1;
              box.size(60, 150);
              box.pos(260, 260);
              this.spinWin.addChild(box);
              createImageRotation(prizestable[i].name,260,258,60,80,box,true,prizestable[i].imgUrl,2,0.5,2.1,Number(spinRotation*(i+1)-spinRotation/2))
              createLabelRotation('SimHei',28,lblColor,260,260,prizestable[i].name,prizestable[i].name,this.spinWin,2,140,28,0.5,8.2,Number(spinRotation*(i+1)-spinRotation/2),'center')
              this.spinWin.graphics.drawPie(260,258,253,startRotation+spinRotation*i,startRotation+spinRotation*(i+1),color,lineColor,lineW)
              
            }
            console.log("转盘",this.spinWin);
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
  }

  /**抽奖 */
  getlottery(){
    this.wardindex=null;
    ajax({
      type: 'POST',
      url: URL.getlottery,
      data:{
        wheelId:this.wheelId,
      },
      dataType:'json',
      // contentType:'application/json',
      async: true,
      success:(res)=>{
        if (res.code == 1) {
          console.log("data",res.data)
          this.wardid = res.data.id;
          this.getStatusInfo();
          sound.playSound(soundUrl.lunckySound,1)
          //消耗金币转转盘
          if(this.wheelCount==0){
            this.costMoney.text = '-'+this.costCoin;
            this.costMoney.visible = true;
            this.costMoney.alpha = 1;
            Laya.Tween.to(this.costMoney,{
              y:850,
            },400,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
              Laya.Tween.to(this.costMoney,{
                alpha: 1,
              },400,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
                this.costMoney.visible = false;
                this.costMoney.alpha = 0;
                this.costMoney.y = 930;
              },null,true));
            },null,true));
          }else{
            this.costMoney.visible = false;
          }
          this.prizestable.forEach((element, index) => {
            if (element.id == res.data.id) {
              this.wardindex = index;
              this.prizeimg = element.imgUrl;
              this.prizetype = res.data.prizetype;
              console.log("this.prizetype",this.prizetype);
              this.prizeamount = res.data.coin;
              this.conf = res.data.conf;
              if(this.prizetype==5){
                this.commodity = res.data.commodity;
              }
            }
          });
          gameControl.I.updateWheelNum(this.wheelCount-1);
          if(this.spinWin.rotation>360){
            this.spinWin.rotation-=360*3;
          }
          Laya.Tween.to(this.spinWin, {rotation:360*3-this.wardindex*this.spinRotation-this.spinRotation/2}, 4000, Laya.Ease.sineInOut, Laya.Handler.create(this,  ()=>{
              gameControl.I.getfameMsg("123");
              if(this.prizetype==1||this.prizetype==7){
                goldAni.goldAniFuc(this.prizeamount);
                Data.coin+=Number(this.prizeamount);
                gameControl.I.updateCoin();
              }else if(this.prizetype==2){
                /**打开弹窗及传参，scene类型页也可用此方法传参 */
                Laya.Dialog.open(Scenes.spinToast,false,{imgUrl:element.imgUrl,name:element.name,linkUrl:''});
              }else if(this.prizetype==3){
                //跳转游戏
                if(this.conf==1){
                  //农场问答
                  Laya.Dialog.open(Scenes.questionAndAnswer);
                }
                if(this.conf==2){
                  Laya.Dialog.open(Scenes.cardGame);
                }
                
              }else if(this.prizetype==4){
                //跳转链接
                getCaption(linkUrl)
              }else if(this.prizetype==5){
                //优惠商品
                /**打开弹窗及传参，scene类型页也可用此方法传参 */
                if(this.commodity!==null){
                  Laya.Dialog.open(Scenes.spinToast,false,{imgUrl:this.commodity.imgUrl,name:this.commodity.name,linkUrl:this.commodity.linkUrl});
                  
                }else{
                  
                }
              }else if(this.prizetype==6){
                //谢谢参与
                Laya.Dialog.open(Scenes.Tip,false,{content:'谢谢参与~'})
              }
              if(this.wheelCount==0&&this.costWheelCount>0&&wheelFish){
                //如果免费次数用完则需要刷新转盘
                this.spinWin._children=[];
                this.getInfoAndList();
              }
              
          }));
        } else {
          //您的操作太频繁了
          // Laya.Dialog.open(Scenes.Tip, false, {content:res.msg});
        }
        
      },
      error:function(){
        //失败后执行的代码
        console.log('请求失败');
      }
    })
  }
  /**获取转盘按钮状态 */
  getStatusInfo(){
    ajax({
      type: 'POST',
      url: URL.getStatusInfo,
      data:{},
      dataType:'json',
      // contentType:'application/json',
      async: true,
      success:(res)=>{
        if (res.code == 1) {
          console.log("转盘按钮状态",res);
          this.adCount = res.data.adCount;
          this.wheelCount = res.data.wheelCount;//免费次数
          this.costCoin = res.data.costCoin;//金币次数一次花费的金币数
          this.costWheelCount = res.data.costWheelCount;//金币次数
  
          if(!dwidth){
            dwidth = textSize('40px','Microsoft YaHei', 'X'+this.wheelCount).width;
            this.rightText.x = this.rightText.x + dwidth + 10;
          }
          //免费次数用完  金币次数用完
          //免费次数用完 金币次数没有用完
          //免费次数没用完 金币次数没用完
          if(this.wheelCount==0){
            wheelFish = true;
            this.freeGameNum.visible = false;
            this.clickBtn.label = this.costCoin+'金币开始 X'+this.costWheelCount;
            if(this.costWheelCount==0){
              this.clickBtn.skin = 'spinwin/b3.png';
              this.clickBtn.mouseEnabled=false;
            }else{
              Data.coin-=Number(this.costCoin);
              gameControl.I.updateCoin();
              this.clickBtn.skin = 'spinwin/b1.png';
              this.clickBtn.mouseEnabled=true;
            }
          }else{
            wheelFish = false;
            this.freeGameNum.visible = true;
            this.clickBtn.skin = 'spinwin/b1.png';
            this.clickBtn.label = this.costCoin+'金币开始 X'+this.costWheelCount;
            this.clickBtn.mouseEnabled=true;
          }
          this.freeNum.text = 'X'+this.wheelCount;
        }
      },
      error:function(){
        //失败后执行的代码
        console.log('请求失败');
      }
    })
  }

  onClosed(){
    Laya.timer.clearAll(this);
  }
}