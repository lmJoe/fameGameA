import Data from "../common/Data";
import RequestLoading from "../common/RequestLoading";
import Scenes from "../common/Scenes";
import Toast from "../common/Toast";
import { ajax } from "../units/ajax";
import { dateChangeFormat, getCaption } from "../units/units";
import URL from "../units/url";

export default class exchangelist extends Laya.Dialog {

    constructor() { 
        super(); 
    }
    onEnable() {
      RequestLoading.show()
      this.closeOnSide=false;/**作为让dialog弹窗只点击关闭按钮关闭弹窗 */
      this.closeBtn.on(Laya.Event.MOUSE_DOWN,this,this.clickBtnClick);
      this.leftBtn.on(Laya.Event.MOUSE_DOWN,this,this.leftBtnClick);
      this.rightBtn.on(Laya.Event.MOUSE_DOWN,this,this.rightBtnClick);
      this.addAddress.on(Laya.Event.MOUSE_DOWN,this,this.addAddressClick);
      this.sceneValue = Data.sceneValue;
      this.getGoodsList()
      this.getOrders()
      setTimeout(() => {
        if(this.sceneValue==2){
          this.rightBtnClick()
        }else if(this.sceneValue==1){
          this.leftBtnClick()
        }
      }, 200);
      
    }

    onGotData(){
      RequestLoading.hide();
    }
    clickBtnClick(){
      Laya.Dialog.close(Scenes.exchangelist);
    }
    /**点击水果订单 */
    leftBtnClick(){
      this.leftBtn.color = '#222222';
      this.rightBtn.color = '#666666';
      this.leftLine.visible = true;
      this.rightLine.visible = false;
      this.panelGoods.visible = false;
      if(this.fruitlist.length==0){
        this.nullList.visible = true;
        this.nullListText.visible = true;
        this.leftList.visible = false;
      }else{
        this.nullList.visible = false;
        this.nullListText.visible = false;
        this.leftList.visible = true;
      }
    }
    /**点击商品订单 */
    rightBtnClick(){
      this.leftBtn.color = '#666666';
      this.rightBtn.color = '#222222';
      this.leftLine.visible = false;
      this.rightLine.visible = true;
      this.leftList.visible = false;
      if(this.shoplist.length==0){
        this.nullList.visible = true;
        this.nullListText.visible = true;
      }else{
        this.panelGoods.visible = true;
        this.nullList.visible = false;
        this.nullListText.visible = false;
      }
    }
    /**新增地址 */
    addAddressClick(){
      Data.addressPageType = 2;
      Laya.Dialog.open(Scenes.shippAddress)
    }
    /**水果订单列表 */
    getOrders(){
      ajax({
        type: 'POST',
        url: URL.getOrders,
        data:{
          pageIndex:1,
          pageSize:10,
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            this.onGotData();
            this.fruitlist = res.data;
            if(this.fruitlist.length==0){
              this.nullList.visible = true;
              this.nullListText.visible = true;
            }else{
              this.nullList.visible = false;
              this.nullListText.visible = false;
              this.createList1(this.fruitlist);
              this.leftBtn.text = '水果订单('+this.fruitlist.length+')';
              
            }
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
      
    }
     /**商品订单列表 */
    getGoodsList(){
      ajax({
        type: 'POST',
        url: URL.getGoodsList,
        data:{
          lastId:'',
          pageSize:''
        },
        dataType:'json',
        // contentType:'application/json',
        async: true,
        success:(res)=>{
          if (res.code == 1) {
            this.onGotData();
            let hisList = res.data.hisList;
            let newList = res.data.newList;
            this.shoplist = newList.concat(hisList);
            if(hisList.length==0&&newList.length==0){
              this.panelGoods.visible = false;
              this.nullList.visible = true;
              this.nullListText.visible = true;
            }else{
              this.nullList.visible = false;
              this.nullListText.visible = false;
              this.panelGoods.visible = true;
              this.createList(this.shoplist);
              this.rightBtn.text = '商品('+newList.length+')';
            }
          }
        },
        error:function(){
          //失败后执行的代码
          console.log('请求失败');
        }
      })
      
    }
    createList(list){
      Laya.loader.load('prefab/ExchangeRecordGoodsItem.prefab', Laya.Handler.create(this, (prefab)=>{
        for(var i in list){
          let goodsItem=Laya.Pool.getItemByCreateFun('goodsItem', prefab.create, prefab);
          this.vboxGoods.addChild(goodsItem);
          this.updateItem(goodsItem, list[i]);
        }
        /**重新更新当前列表的zOrder的值，重新排序 */
        this.vboxGoods.updateZOrder();
        this.vboxGoods.on(Laya.Event.MOUSE_UP, this, this.onCellClick)
      }))
    }
    updateItem(cell, data) {
      cell.dataSource=data;
      cell.getChildByName("shopImg").skin = data.imgurl;
      cell.getChildByName("shopNmae").text = data.name;
      cell.getChildByName("endTime").text = '有效期至：'+data.endtime;
      cell.getChildByName("shopCode").text = data.code;
      if(new Date(data.endtime).getTime() < new Date().getTime()){ //已过期
        cell.getChildByName("shadow").visible = true;
        cell.getChildByName("statusIcon").visible = true;
        cell.getChildByName("statusIcon").skin = 'exchangelist/icon2-2.png';
      }else{
        if(data.status==2){
          cell.getChildByName("statusIcon").visible = true;
          cell.getChildByName("statusIcon").skin = 'exchangelist/icon2.png';
          cell.getChildByName("shadow").visible = true;
        }else if(data.status==1){
          cell.getChildByName("statusIcon").visible = false;
          cell.getChildByName("shadow").visible = false;
        }
      }
    }
    onCellClick(e, i) {
      var dataSource = e.target.parent.dataSource;
      if (e.target.name == 'useCoupons') {
        sound.playSound(soundUrl.playSoundClick,1);
        console.log("使用");
        getCaption(dataSource.thirdUrl)
        //使用
      }else if (e.target.name == 'copyBtn') {
        sound.playSound(soundUrl.playSoundClick,1);
        let input=document.createElement('input');
        input.value=dataSource.code;
        document.body.appendChild(input);
        input.select();
        Laya.Browser.document.execCommand("copy");
        input.remove();
        Toast.show('复制成功')
      }
    }
    createList1(list){
      this.leftList.vScrollBarSkin = "";
      this.leftList.selectEnable = true;
      this.leftList.renderHandler = new Laya.Handler(this, this.updateItem1);
      this.leftList.mouseHandler = new Laya.Handler(this, this.onCellClick1);
      this.leftList.array = list;
    }
    updateItem1(cell, index) {
      cell.getChildByName("fruitImg").skin = cell.dataSource.rescodes;
      cell.getChildByName("fruitTitle").text = cell.dataSource.itemName;
      cell.getChildByName("exChangeTime").text = '兑换时间：'+dateChangeFormat('YYYY-mm-dd HH:MM:SS',cell.dataSource.createtime);
    }
    onCellClick1(e, i) {
      if(e.type == Laya.Event.MOUSE_UP){
        let dataSource = e.currentTarget.dataSource;
        let orderNo = dataSource.orderNo;
        Laya.Dialog.open(Scenes.shureOrder,true,{orderNo:orderNo});
      }
    }
}