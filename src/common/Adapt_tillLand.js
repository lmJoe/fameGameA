export default new class Adapt_tillLand{
  init(view){
      let baseH=1600, stageH=Laya.stage.height;
      let ratio=stageH/baseH;
      this.ratio=ratio;
      /**背景图 */
      let bg=view.bg;
      /**头像 */
      let persionBox=view.persionBox;
      /**操作工 */
      let operator=view.operator;
      /** */
      // let TipBox = view.TipBox;
      /**农田 */
      let fameBox=view.fameBox;
      /**订单列表 */
      let orderList = view.orderList;
      /**菜园按钮 */
      let menu = fameBox.menu;
      fameBox.centerX=0;
      fameBox.centerY=450*ratio;
      menu.centerY=250*ratio;
      if(stageH<baseH){
        
          bg.centerY=50*ratio;
          persionBox.y=80*ratio;
          orderList.y=210*ratio;
          
          // task.left*=ratio*2;
          persionBox.scale(ratio, ratio);
          operator.scale(ratio, ratio);
          orderList.scale(0.9*ratio, 0.9*ratio);
          operator.centerY=-202*ratio;
          // goldRushBox.centerY=-260*ratio;
          // TipBox.scale(ratio, ratio);
          // TipBox.centerY=-302*ratio;
      }
  }
}