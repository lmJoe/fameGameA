export default new class Adapt{
  init(view){
      let baseH=1400, stageH=Laya.stage.height;
      let ratio=stageH/baseH;
      this.ratio=ratio;
      /**抽卡框 */
      let box1 = view.box1;
      if(stageH<baseH){
          // box1.centerY=-140*ratio;
          // box1.scale(ratio*1.1, ratio*1.1);
      }
  }
}