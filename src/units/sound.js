export default new class Audio{
  //播放背景音乐
  playMusic(url, loops){
      Laya.SoundManager.playMusic(url, loops);
  }
  //播放音效
  playSound(url, loops){
      Laya.SoundManager.playSound(url, loops);
  }
  //关闭所有音乐与音效
  stopAll(){
      Laya.SoundManager.stopAll();
  }
  //关闭所有背景音乐
  stopMusic(){
      Laya.SoundManager.stopMusic();
  }
  //关闭指定音效
  stopSound(url){
      Laya.SoundManager.stopSound(url);
  }
  //摧毁指定音效
  destroySound(url){
      Laya.SoundManager.destroySound(url);
  }
  //关闭所有音效
  stopAllSound(){
      Laya.SoundManager.stopAllSound();
  }
}