export default new class particle{
  //浇水植物粒子效果
  plantParticle(node){
    Laya.loader.load('particle/plantParticle.part',new Laya.Handler(this,()=>{
      //获取粒子配置
      let setting = Laya.loader.getRes("particle/plantParticle.part");
      //创建粒子
      let particle = new Laya.Particle2D(setting);
      particle.x=node.width/2;
      particle.y=node.height;
      particle.zOrder=5;
      node.addChild(particle);
      // particle.emitter.start();
      particle.play();
      //销毁粒子
      Laya.timer.once(1500,this,function(){
        particle.destroy();
      });
      
    }))
  }
}