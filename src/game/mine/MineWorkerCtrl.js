import sound from "../../units/sound";
import soundUrl from "../../units/soundUrl";

export default class MineWorkerCtrl extends Laya.Script{
    onAwake(){
      MineWorkerCtrl.I=this;
    }
    init(workerID, level, imgProgressCoin){
        this.workerID=workerID;
        this.idle=new Laya.Image();
        this.owner.addChild(this.idle);
        this.aniSpeedMap=[55, 45, 37, 31, 27];

        this.ani=new Laya.Animation();
        this.ani.interval=55;
        this.ani.pos(0, -20);
        this.ani.name = 'workerAni';
        this.ani.on(Laya.Event.LABEL, this, this.showFlyCoin);
        this.ani.addLabel('flyCoin', 20);
        this.owner.addChild(this.ani);
        this.setLevel(level);

        let pointGlobal=imgProgressCoin.localToGlobal(new Laya.Point(0, 0), false);
        this.pointFlyTo=this.owner.globalToLocal(pointGlobal, false);
    }

    setLevel(level){
        this.level=level;
        this.ani.interval=this.aniSpeedMap[level-1];
        this.idle.skin='newdiggold/worker'+level+'.png';
        this.idle.name='workerImg';
        this.ani.loadAtlas('mineWorker/a'+level+'.atlas');
    }

    playIdle(){
        this.idle.visible=true;
        this.ani.visible=false;
        this.ani.stop();
        console.log("挖矿完成");
        // sound.stopMusic(soundUrl.miningSound)
    }

    playWork(){
        this.idle.visible=false;
        this.ani.visible=true;
        let rand=Math.floor(Math.random()*20);
        this.ani.play(rand);
        console.log("开始挖矿");
        // sound.playMusic(soundUrl.miningSound,0)
    }

    showFlyCoin(){
        let spCoin=Laya.Pool.getItemByCreateFun('mineFlyCoin'+this.workerID, this.createFlyCoin, this);
        this.owner.addChild(spCoin);
        spCoin.tlFly.play(0, false);
    }

    createFlyCoin(){
        let sp=new Laya.Sprite();
        sp.texture='newdiggold/icon-coin.png';
        sp.pos(60, 60);
        sp.scale(0.7, 0.7);
        let tlFly=new Laya.TimeLine();
        sp.tlFly=tlFly;
        tlFly.on(Laya.Event.COMPLETE, this, this.recoverFlyCoin, [sp]);
        let x=this.pointFlyTo.x, y=this.pointFlyTo.y;
        if(this.owner.scaleX==-1){
            x=this.pointFlyTo.x-sp.width;
        }
        tlFly.to(sp, {x:x, y:y, scaleX:1, scaleY:1}, 500);
        return sp;
    }

    recoverFlyCoin(target){
        target.removeSelf();
        // console.log("target",target);
        Laya.Pool.recover('mineFlyCoin'+this.workerID, target)
    }
    recoverWorker(){
      if(this.ani){
        this.ani.removeSelf();
        this.ani.clear();
        this.ani = null;
      }
      
    }
    // onDestroy(){
    //   this.recoverFlyCoin();
    // }
}