
  var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
  r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
  32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
  2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
  q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
  a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
  e)).finalize(b)}}});var n=d.algo={};return d}(Math);
  (function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
  l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
  (function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
  _doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
  f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
  m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
  E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
  4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
  (function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
  l)}})();
  CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
  finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
  c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
  e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
  this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
  1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
  decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
  b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
  (function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
  16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
  8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
  d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();
  
  CryptoJS.mode.ECB = (function () {
      var ECB = CryptoJS.lib.BlockCipherMode.extend();

      ECB.Encryptor = ECB.extend({
          processBlock: function (words, offset) {
              this._cipher.encryptBlock(words, offset);
          }
      });

      ECB.Decryptor = ECB.extend({
          processBlock: function (words, offset) {
              this._cipher.decryptBlock(words, offset);
          }
      });

      return ECB;
  }());
  CryptoJS.pad.NoPadding = {
      pad: function () {
      },

      unpad: function () {
      }
  };
var target,duration,EaseAnimation,tween;
import Data from '../common/Data.js';
import Bridge from './JSbridge.js'
var secretKey = 'yXIGfPfF$OOlWae0H^nmR*TS8@frw%5V';
var eventArr = [];
// duration 动画持续时间 target 需要做动画的节点 动画节奏 EaseAnimation,xValue横向值，yValue纵向值
function scaleXY1(duration,target,EaseAnimation,xValue,yValue){
  Laya.Tween.clearTween(scaleXY1);
  Laya.Tween.to(target,{
    scaleX: xValue,
    scaleY: yValue
  },duration,EaseAnimation,Laya.Handler.create(this,scaleXY2(duration,target,EaseAnimation,xValue,yValue)));
}
function scaleXY2(duration,target,EaseAnimation,xValue,yValue){
  Laya.Tween.clearTween(scaleXY2);
  Laya.Tween.to(target,{
    scaleX: 1,
    scaleY: 1
  },duration,EaseAnimation,Laya.Handler.create(this,scaleXY1(duration,target,EaseAnimation,xValue,yValue)));
}

function moveY1(node,yValue){
  console.log(yValue-10);
  Laya.Tween.clearTween(moveY1);
  Laya.Tween.to(node,{
    // y: yValue-10,
  },5000,Laya.Ease.linearOut,Laya.Handler.create(this,moveY2(node,yValue)));
}
function moveY2(node,yValue){
  console.log(yValue+10);
  Laya.Tween.clearTween(moveY2);
  Laya.Tween.to(node,{
    // y: yValue+10,
  },5000,Laya.Ease.linearOut,Laya.Handler.create(this,moveY1(node,yValue)));
}
//node 当前创建的节点名称 parentNode 父节点名称 sizeX-宽 sizeY-高 imgUrl-图片地址 x-水平位置 y-垂直位置
function createSprite(nodeName,parentNode,sizeX,sizeY,imgUrl,x,y,zIndex,showBoolean){
  var createSprite = new Laya.Sprite();
  createSprite.loadImage(imgUrl);
  createSprite.name = nodeName;
  createSprite.zOrder = zIndex;
  createSprite.visible = showBoolean;
  createSprite.pos(x,y);
  createSprite.size(sizeX,sizeY);
  parentNode.addChild(createSprite);
  return createSprite;
}
function createImage(nodeName,x,y,sizeX,sizeY,parentNode,showBoolean,imgURL,zIndex){
  var createImg = new Laya.Image(imgURL);
  createImg.name = nodeName;
  createImg.size(sizeX,sizeY)
  createImg.visible = showBoolean;
  createImg.zOrder = zIndex;
  createImg.pos(x,y);
  parentNode.addChild(createImg);
  return createImg;
}
function createImage1(nodeName,x,y,sizeX,sizeY,parentNode,showBoolean,imgURL,zIndex,centerY,right,bottom,top,left){
  var createImg = new Laya.Image(imgURL);
  createImg.name = nodeName;
  createImg.size(sizeX,sizeY)
  createImg.visible = showBoolean;
  createImg.zOrder = zIndex;
  createImg.pos(x,y);
  createImg.centerY = centerY;
  createImg.right = right;
  createImg.bottom = bottom;
  parentNode.addChild(createImg);
  console.log(11111, sizeX, sizeY, parentNode );
  return createImg;
}
function createImageRotation(nodeName,x,y,sizeX,sizeY,parentNode,showBoolean,imgURL,zIndex,anchorX,anchorY,rotation){
  Laya.loader.load(imgURL, Laya.Handler.create(this, (texture)=>{
    var createImg = new Laya.Image();
    createImg.texture=texture;
    let ratio=texture.height/texture.width;
    createImg.size(85, 85*ratio);
    createImg.centerX=0;
    createImg.anchorY=0.5;
    parentNode.addChild(createImg);
  }), null, Laya.Loader.IMAGE)
}
function createButton(nodeName,x,y,sizeX,sizeY,parentNode,showBoolean,imgURL,zIndex,text,stateNum,labelFont,labelSize,labelColor,selected){
  var button = new Laya.Button(imgURL);
  button.name = nodeName;
  button.size(sizeX,sizeY)
  button.label = text;
  button.labelFont = labelFont;
  button.labelSize = labelSize;
  button.labelColors = labelColor;
  button.selected = selected;
  button.stateNum = stateNum;
  button.visible = showBoolean;
  button.zOrder = zIndex;
  button.pos(x,y);
  parentNode.addChild(button);
  return button;
}
//node 当前创建的节点名称 parentNode 父节点名称 text-填充内容  fontSize-字体大小 x-水平位置 y-垂直位置 color-字体颜色 font-字体 align-水平位置
function createText(text,fontSize,nodeName,color,x,y,font,parentNode,align,strokeColor,strokeBorder,tW,tH,zIndex){
  var createText = new Laya.Text();
  createText.font = "Microsoft YaHei";
  createText.text = text;
  createText.width = tW;
  createText.height = tH;
  createText.strokeColor = strokeColor;
  createText.strokeBorder = strokeBorder;
  createText.fontSize = fontSize;
  createText.zOrder = zIndex;
  createText.name = nodeName;
  createText.color = color;
  createText.align = align;
  createText.pos(x,y);
  parentNode.addChild(createText);
  return createText;
}
//x，y为圆心坐标 radius半径 background填充色
function createCircle(Ox,Oy,radius,background,x,y,sizeX,sizeY,parendNode,nodeName,imhObj,imgX,imgY,ImgW,ImgH){
                      // 7,0,41,'#ffffff',36,40,40,40,that.scrollbarMsg,'scrollbarImg','comp/icon6.png',20,10,20,20
  // var headImg=new Laya.Sprite();
  // headImg.loadImage(imhObj);
  // headImg.pos(imgX, imgY);
  // headImg.width = ImgW;
  // headImg.height = ImgH;
  // var createCircle = new Laya.Sprite();
  // createCircle.graphics.drawCircle(Ox, Oy, radius, background);
  // createCircle.pos(x,y);
  // createCircle.name = nodeName;
  // createCircle.width =sizeX;
  // createCircle.height = sizeY;
  // headImg.mask = createCircle;
  // parendNode.addChild(createCircle);
  

  //带遮罩的显示对象
      var headImg=new Laya.Sprite();
      headImg.loadImage(imhObj);
      headImg.pos(10, 8);
      headImg.width = 40;
      headImg.height = 40;
      //创建遮罩对象
      var headImgMask = new Laya.Sprite();
      //画一个圆形的遮罩区域
      headImgMask.graphics.drawCircle(7,0,20,"#ffffff");
      headImgMask.pos(12,20);
      headImgMask.width =40;
      headImgMask.height = 40;
      headImg.mask=headImgMask;
      parendNode.addChild(headImg);
  return createCircle;
}
function createList(exchangeList,nodeName,addArea,spaceX,spaceY,repeatX,repeatY,x,y,boolean,selectHandler,renderHandler){
  var list = new List();
  list.itemRender = backpackItem;
  list.name = nodeName;
  list.spaceX = spaceX;//x方向
  list.spaceY = spaceY;//y方向
  list.repeatX = repeatX;
  list.repeatY = repeatY;
  list.x = x;
  list.y = y;
  // 使用但隐藏滚动条
  list.vScrollBarSkin = "";
  list.selectEnable = boolean;
  list.selectHandler = new Handler(selectHandler);
  list.renderHandler = new Handler(renderHandler);
  //创建list命名分别为item0 item1 item2放入弹框的固定区域exchangeArea，每次点击按钮切换是根据当前item0 item1 item2 来做定位切换的
  addArea.addChild(list);
  list.array = exchangeList;
  
}
//创建进度条
function createProgressBar(nodeName,parentNode,progressBarImg,pWidth,pHeight,Px,Py,Pvalue){
  var ProgressBar = new Laya.ProgressBar(progressBarImg);
  parentNode.addChild(ProgressBar);
  ProgressBar.name = nodeName;
  ProgressBar.width = pWidth;//组件长度
  ProgressBar.height = pHeight;//组件长度
  ProgressBar.pos(Px, Py);//组件显示的位置
  ProgressBar.value = Pvalue;//当前的进度量.介于0和1之间,默认不设置时是0.5，即会出现在中间的位置
  return ProgressBar;
}
function createLabel(font,fontSize,color,x,y,text,nodeName,parentNode,zIndex,labelW,labelH){
  var label = new Laya.Label();
  label.font = font;
  if(nodeName=="personName"){
    label.text = text.substr(0,5) + "...";
  }else{
    label.text = text;
  }
  label.width = labelW;
  label.height = labelH;
  label.pos(x,y);
  label.zOrder = zIndex;
  label.name = nodeName;
  label.fontSize = fontSize;
  label.color = color;
  parentNode.addChild(label);
  return label;
}
function createLabelRotation(font,fontSize,color,x,y,text,nodeName,parentNode,zIndex,labelW,labelH,anchorX,anchorY,rotation,align){
  var label = new Laya.Label();
  label.font = font;
  if(nodeName=="personName"){
    label.text = text.substr(0,5) + "...";
  }else{
    label.text = text;
  }
  label.width = labelW;
  label.height = labelH;
  label.anchorX = anchorX;
  label.anchorY = anchorY;
  label.rotation = rotation;
  label.align = align;
  label.pos(x,y);
  label.zOrder = zIndex;
  label.name = nodeName;
  label.fontSize = fontSize;
  label.color = color;
  parentNode.addChild(label);
  return label;
}
// /**
//  * @author xxxx
//  * @description 保存cookie
//  * @param {String} name 需要存储cookie的key
//  * @param {String} value 需要存储cookie的value
//  * @param {Number} timer 默认存储多少天
//  */
// function setCookie(name,value,timer=0.068){
//   //十分钟
//   var Days = timer; //默认将被保存 1 天
//   var exp  = new Date();
//   exp.setTime(exp.getTime() + Days*24*60*60*1000);
//   document.cookie = name + "="+ escape(value) +";expires="+ exp.toGMTString();
// }
function setCookie(cname, value, expires=1) {
  var Days = expires;
  let date = new Date()
  // date.setTime(date.getTime() + Days * 60 * 1000)
  date.setTime(date.getTime() + Days*24*60*60*1000) //一天
  document.cookie = cname + '=' + escape(value) + ';expires=' + date.toUTCString()
}
/**
 * @author xxxx
 * @description 获取cookie
 * @param {String} name 需要获取cookie的key
 */
function getCookie(name){
  var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
  if(arr != null){
    return unescape(arr[2])
  }else{
    return null
  }
}

/**
 * @author xxxx
 * @description 删除cookie
 * @param {String} name 需要删除cookie的key
 */
function clearCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null) document.cookie=name +"="+cval+";expires="+exp.toGMTString();
  Laya.LocalStorage.clear(name)
}
/**倒计时 时分秒 */
function dateChangeFormat(format, date) {
  let index=date.indexOf('+');
  if(index>-1){
    date=date.substring(0, index);
  }
  date=date.replace('T',' ');
  date = new Date(date.replace(/-/g,'/'));
  const dataItem = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString(),
  };
  Object.keys(dataItem).forEach((item) => {
    const ret = new RegExp(`(${item})`).exec(format);
    if (ret) {
      format = format.replace(ret[1], ret[1].length === 1 ? dataItem[item] : dataItem[item].padStart(ret[1].length, '0'));
    }
  });
  return format;
}
function Djs_timeList(itemEnd){
  let index=itemEnd.indexOf('+');
  if(index>-1){
    itemEnd=itemEnd.substring(0, index);
  }
  itemEnd=itemEnd.replace('T',' ');
  var endItem=new Date(itemEnd.replace(/-/g,'/')).getTime();//获取列表传的截止时间
  var nowItem=new Date().getTime();//获取当前时间
  var rightTime = endItem - nowItem;//截止时间减去当前时间
    var hh = Math.floor((rightTime / 1000 / 60 / 60) % 24);
    var mm = Math.floor((rightTime / 1000 / 60) % 60);
    var ss = Math.floor((rightTime / 1000) % 60);
    if(hh<10){
      hh = '0'+hh
    }
    if(mm<10){
      mm = '0'+mm
    }
    
    if(ss<10){
      ss = '0'+ss;
    }
    var showTime= hh + ":" + mm + ":" + ss;

    // this.MerchantDemandList.status=1
  return showTime;
}
function someDaySomeTime(time) {
    var someDay = Math.round(new Date(time).getTime()/1000);
    return someDay
}
function getQueryVariable(variable){
  const reg = new RegExp("(^|&)" + variable + "=([^&]*)(&|$)", "i");
  const urlObj = window.location;
  var r = urlObj.href.indexOf('#') > -1 ? urlObj.hash.split("?")[1].match(reg) : urlObj.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
function checkImgExists(imgurl) {
  return new Promise(function(resolve, reject) {
    var ImgObj = new Image();
    ImgObj.src = imgurl;
    ImgObj.onload = function(res) {
      resolve(res);
    }
    ImgObj.onerror = function(err) {
      reject(err)
    }
  })
}

//计算两个时间戳之间相差
function getRemainderTime (startTime,endTime){
    var s1 = new Date(startTime.replace(/-/g, "/")),
    s2 = new Date(endTime.replace(/-/g, "/")),
    runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
    var year = Math.floor(runTime / 86400 / 365);
    runTime = runTime % (86400 * 365);
    var month = Math.floor(runTime / 86400 / 30);
    runTime = runTime % (86400 * 30);
    var day = Math.floor(runTime / 86400);
    runTime = runTime % 86400;
    var hour = Math.floor(runTime / 3600);
    runTime = runTime % 3600;
    var minute = Math.floor(runTime / 60);
    runTime = runTime % 60;
    var second = runTime;
   // console.log(year,month,day,hour,minute,second);
// 　　return year+','+month+','+day+','+hour+','+minute+','+second;
    return hour+'小时'+minute+'分钟';
}
function tipAnimation(node,yValue){
  tween && Laya.Tween.clearTween();
  tween = Laya.Tween.to(node,{
    y: yValue,
  }, 5000,Laya.Ease.linearOut,Laya.Handler.create(this,function(){
　　 moveY2(node,yValue);
　},null,true));
}
//数组去重
function unique( arr ){
    arr = arr.sort();
    var arr1 = [arr[0]];
    for(var i=1,len=arr.length;i<len;i++){
        if(arr[i] !== arr[i-1]){
            arr1.push(arr[i]);
        }
    }
    return arr1;
}
function decrypt(encryptedData, key) {
  var key1 = CryptoJS.enc.Utf8.parse(key);
  var decryptedData = CryptoJS.AES.decrypt(encryptedData, key1, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
  return decryptedStr
};
function getMyDate(str) {
  var c_Date;
  if (str > 9999999999) {
    c_Date = new Date (parseInt (str));
  } else {
    c_Date = new Date (parseInt (str) * 1000) ;
  }
  // var c_Year = c_Date.getFullYear(),
  // c_Month = c_Date.getMonth() +1,
  // c_Day = c_Date.getDate(),
  // c_Hour = c_Date.getHours(),
  // c_Min = c_Date.getMinutes(),
  // c_Sen = c_Date.getSeconds();
  // var c_Time = getzf (c_Year) +"-"+getzf (c_Month) +"-"+getzf (c_Day) +" "+getzf (c_Hour) +":"+ getzf(c_Min)
  return c_Date;
};
function getzf(c_num){
  if(parseInt(c_num)<10){
    c_num = '0'+ c_num;
  }
  return c_num;
}
//最后一步：将所有节点封装到字典里，方便获取
function GetAllChildrenMap(parentNode){
  var map = [];
  parentNode = parentNode._children;
    for (let i = 0; i < parentNode.length; i++){
        if(!map.includes(parentNode[i]._bits))
        {
            map.push(parentNode[i]._bits);
        }
    }
    return map;
}
function sendEvent(eventName,paramObj) { // 触发事件
  var len = eventArr.length;
  for (var i = 0; i < len; i++) {
    if (eventArr[i].eventName == eventName) {
      var pa = paramObj || {};
      for (var j = 0; j < eventArr[i].cbArray.length; j++) {
        eventArr[i].cbArray[j].callback(pa);
      }
      break;
    }
  }
}
function addEventListener(eventName,cb) { // 注册自定义事件
    eventArr = [];
    eventArr.push({ eventName: eventName, cbArray: [{ callback: cb }] });
}
/**数组中随机取 */
function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function getCaption(obj){
  if(obj!==null||obj!==''){
    
    //判断是否符合http://符合返回真不符合返回假
    var http = /^http:\/\/.*/i.test(obj);
    //判断是否符合https://符合返回真不符合返回假
    var https = /^https:\/\/.*/i.test(obj);
    //如果两个都为假，则使用 window.location.href跳转
    var wxmpnt = /^wxmpnt:\/.*/i.test(obj);
    var wxmpst = /^wxmpst:\/.*/i.test(obj);
    if (http || https) {
      let linkUrl = obj+'&appVer='+Data.appVer;
      var params = {"ActivityPath":linkUrl};
      console.log("linkUrl",linkUrl)
      Bridge.callHandler('gotoActivity', params, (responseData)=>{});
    }else if(wxmpnt){
      obj = obj.slice(7)
      wx.miniProgram.navigateTo({url: obj})
    }else if(wxmpst){
      obj = obj.slice(7)
      wx.miniProgram.switchTab({url: obj})
    }
  }else{
    return;
  }
}
function removeDuplicateObj(arr){
  /**根据id值去重 */
  let obj = {};
  arr = arr.reduce((newArr, next) => {
    obj[next.id] ? "" : (obj[next.id] = true && newArr.push(next));
    return newArr;
  }, []);
  return arr;
};
function changeUrlArg(url, arg, val){
  var pattern = arg+'=([^&]*)';
  var replaceText = arg+'='+val;
  return url.match(pattern) ? url.replace(eval('/('+ arg+'=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url+'&'+replaceText : url+'?'+replaceText);
}
/**倒计时 时分 根据时间戳 */
function GetRTime(NowTime,EndTime){
  // debugger
//后台给我的是10位 精确到秒的  所有下面我就除以了1000，不要小数点后面的
  var t = EndTime - NowTime;
  //如果后台给的是毫秒 上面不用除以1000  下面的计算时间也都要除以1000 这里我去掉1000了
  var d=Math.floor(t/60/60/24);//天 var d=Math.floor(t/1000/60/60/24)
  var h=Math.floor(t/60/60%24);//时 var h=Math.floor(t/1000/60/60%24)
  var m=Math.floor(t/60%60);//分 var m=Math.floor(t/1000/60%60)
  var s=Math.floor(t%60);//秒 var s=Math.floor(t/1000%60)
  // if(parseInt(d)<10){
  //   d="0"+d;
  // }
  if(parseInt(h)<10){
    h="0"+h;
  }
  if(parseInt(m)<10){
    m="0"+m;
  }
  // if(parseInt(s)<10){
  //   s="0"+s;
  // }
  return h+':'+m;
}
function countdown(EndTime,startTime){
  /**倒计时 时分 根据时间戳 */
  //后台给我的是10位 精确到秒的  所有下面我就除以了1000，不要小数点后面的
  var t = EndTime - startTime;
  if (t <= 0) {
    return '00:00:00';
  }
  // //如果后台给的是秒 上面不用除以1000  下面的计算时间也都要除以1000 这里我去掉1000了
  var d=Math.floor(t/60/60/24);//天 精确到分
  var h=Math.floor(t/60/60%24);//时
  var m=Math.floor(t/60%60);//分 
  var s=Math.floor(t%60);//秒 
  // //精确到豪秒
  // var d=Math.floor(t/1000/60/60/24)
  // var h=Math.floor(t/1000/60/60%24)
  // var m=Math.floor(t/1000/60%60)
  // var s=Math.floor(t/1000%60)
  if(parseInt(d)<10){
    d="0"+d;
  }
  if(parseInt(h)<10){
    h="0"+h;
  }
  if(parseInt(m)<10){
    m="0"+m;
  }
  if(parseInt(s)<10){
    s="0"+s;
  }
  return h+':'+m+':'+s;
}
//秒数转化为时分秒
function formatSeconds(value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取余，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取余的分，获取分钟除以60取余的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + parseInt(secondTime) + "秒";

    if(minuteTime > 0) {
      result = "" + parseInt(minuteTime) + "分" + result;
    }
    if(hourTime > 0) {
      result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
}
//往字符串某个位置插入子字符串
function insertStr (str, index, insertStr) {
  return str.substring(0, index) + insertStr + str.substring(index)
}
//根据字体大小及数量计算文本高宽
function textSize (fontSize, fontFamily, text) {
  var span = document.createElement('span')
  var dom = document.createElement('div')
  dom.style.width = '100%'
  dom.style.height = '10px'
  dom.style.overflow = 'hidden'
  var result = {}
  result.width = span.offsetWidth
  result.height = span.offsetHeight
  span.style.visibility = 'hidden'
  span.style.fontSize = fontSize
  span.style.fontFamily = fontFamily
  span.style.display = 'inline-block'
  dom.appendChild(span)
  document.body.appendChild(dom)
  if (typeof span.textContent !== 'undefined') {
    span.textContent = text
  } else {
    span.innerText = text
  }
  result.width = parseFloat(window.getComputedStyle(span).width) - result.width
  result.height = parseFloat(window.getComputedStyle(span).height) - result.height
  return result
}
export {
  scaleXY1,
  scaleXY2,
  createSprite,
  createImage,
  createText,
  secretKey,
  createCircle,
  createProgressBar,
  createLabel,
  setCookie,
  getCookie,
  clearCookie,
  dateChangeFormat,
  Djs_timeList,
  someDaySomeTime,
  getQueryVariable,
  checkImgExists,
  getRemainderTime,
  unique,
  decrypt,
  createButton,
  tipAnimation,
  GetAllChildrenMap,
  sendEvent,
  addEventListener,
  createImageRotation,
  createLabelRotation,
  getRandomArrayElements,
  getCaption,
  createImage1,
  changeUrlArg,
  removeDuplicateObj,
  getMyDate,
  getzf,
  GetRTime,
  countdown,
  formatSeconds,
  insertStr,
  textSize,
}