(()=>{"use strict";var e,t={494:(e,t,s)=>{var i=s(260),n=s.n(i);class a extends n().Scene{constructor(e,t){super(e),this.config=t,this.fontSize=34,this.lineHeight=42,this.fontOptions={fontSize:`${this.fontSize}px`,fill:"CD00FF",fontStyle:"bold"},this.screenCenter=[t.width/2,t.height/2]}create(){this.add.image(0,0,"sky_bg").setOrigin(0),this.config.canGoBack&&(this.add.image(this.config.width-10,this.config.height-10,"back").setOrigin(1).setScale(3).setInteractive(),backButton.on("pointerup",(()=>{this.scene.start("MenuScene")})))}createMenu(e,t){let s=0;e.forEach((e=>{const i=[this.screenCenter[0],this.screenCenter[1]+s];e.textGo=this.add.text(...i,e.text,this.fontOptions).setOrigin(.5,1),s+=this.lineHeight,t(e)}))}}const r=a;const c=class extends r{constructor(e){super("MenuScene",e),this.menu=[{scene:"PlayScene",text:"Play"},{scene:"ScoreScene",text:"Score"},{scene:"RankScene",text:"Rank"},{scene:"null",text:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this))}setupMenuEvents(e){const t=e.textGo;t.setInteractive(),t.on("pointerover",(()=>{t.setStyle({fill:"#ff0"})})),t.on("pointerout",(()=>{t.setStyle({fill:"#fff"})})),t.on("pointerup",(()=>{e.scene&&this.scene.start(e.scene),"Exit"===e.text&&this.game.destroy(!0)}))}};const o=class extends r{constructor(e){super("PauseScene",e),this.menu=[{scene:"PlayScene",text:"Continue"},{scene:"MenuScene",text:"Exit"}]}create(){super.create(),this.createMenu(this.menu,this.setupMenuEvents.bind(this))}setupMenuEvents(e){const t=e.textGo;t.setInteractive(),t.on("pointerover",(()=>{t.setStyle({fill:"#ff0"})})),t.on("pointerout",(()=>{t.setStyle({fill:"#fff"})})),t.on("pointerup",(()=>{e.scene&&"Continue"===e.text?(this.scene.stop(),this.scene.resume(e.scene)):(this.scene.stop("PlayScene"),this.scene.start(e.scene))}))}},h=s(669),p=async e=>{const{url:t,data:s}=e,{params:i}=(e=>{const t={...e},s=new URLSearchParams;for(const[e,i]of Object.entries(t))s.append(e,i);return{params:s}})(s);return h.post(t,i,{headers:{"Content-type":"application/x-www-form-urlencoded; charset=UTF-8",Accept:"*/*"}})};const l=class extends r{constructor(e){super("PlayScene",e),this.player="Player",this.config=e,this.bird=null,this.pipes=null,this.pipeHorizontalDistance=0,this.difficultyTable=[3,5,10,15,50,100,250,500,2e3,4e3,8e3],this.pipieVerticalDistanceRange=[350,450],this.pipieHorizontalDistanceRange=[550,650],this.fontOptions={fontSize:`${this.fontSize}px`,fill:"CD00FF",fontStyle:"bold"},this.canGoBack=!0,this.DIFFICULTY_STEP=5,this.init()}init(){this.flapVelocity=500,this.gravity=800,this.pipeSpeed=-350,this.scoreStep=1,this.diffSwitch=!1,this.score=0,this.scoreText=""}create(){super.create(),this.createBird(),this.createPipes(),this.createColliders(),this.createHandleInputs(),this.createPause(),this.createScore(),this.listenToevents()}update(){console.log(this.pipeSpeed),this.checkGameStatus(),this.recyclePipes()}listenToevents(){this.pauseEvent||(this.pauseEvent=this.events.on("resume",(()=>{this.initialTime=3,this.countDownText=this.add.text(...this.screenCenter,"Fly again in : "+this.initialTime,this.fontOptions).setOrigin(.5),this.timeEvent=this.time.addEvent({delay:1e3,callback:this.countDown,callbackScope:this,loop:!0})})))}countDown(){this.initialTime--,this.countDownText.setText("Fly again in : "+this.initialTime),this.initialTime<=0&&(this.countDownText.setText(""),this.physics.resume(),this.timeEvent.remove())}playMusic(){}createBG(){this.add.image(0,0,"sky_bg").setOrigin(0)}createPause(){this.add.image(this.config.width-20,this.config.height-20,"pause").setOrigin(1).setScale(4).setInteractive().on("pointerdown",(()=>{this.physics.pause(),this.scene.pause(),this.scene.launch("PauseScene")}))}createRank(){this.add.image(this.config.width/2+80,this.config.height/2+100,"rank").setOrigin(1).setScale(.5,.5).setInteractive().on("pointerdown",(()=>{alert("랭크버튼을 클릭하면 최고점수가 전송됩니다.");localStorage.getItem("bestScore");getAuth();let e={nickname:this.myAuth.name,score:this.bestScore,userUid:this.myAuth.uid};p({url:"http://192.168.0.206:3000/addRank",data:e}).then((({data:e})=>{console.log(e)})).catch((e=>{console.log(e)}))}))}createBack(){if(this.canGoBack){this.add.image(this.config.width-80,this.config.height-22,"back").setOrigin(1).setScale(2.8).setInteractive().on("pointerup",(()=>{this.scene.start("MenuScene")}))}}createBird(){this.bird=this.physics.add.sprite(this.config.startPosition.x,this.config.startPosition.y,"Player").setOrigin(0).setScale(3).setFlipX(!0),this.bird.body.gravity.y=this.gravity,this.bird.setCollideWorldBounds(!0),this.bird.play("fly"),this.anims.create({key:"fly",frames:this.anims.generateFrameNumbers("Player",{start:9,end:16}),frameRate:8,repeat:-1}),this.bird.play("fly")}createPipes(){this.pipes=this.physics.add.group();for(let e=0;e<4;e++){const e=this.pipes.create(0,0,"pipe").setImmovable(!0).setFlipY(!0).setOrigin(0,1),t=this.pipes.create(0,0,"pipe").setImmovable(!0).setOrigin(0,0);this.placePipe(e,t)}this.pipes.setVelocityX(this.pipeSpeed)}createColliders(){this.physics.add.collider(this.bird,this.pipes,this.gameOver,null,this)}createHandleInputs(){this.input.keyboard.on("keydown-SPACE",this.flap,this)}checkGameStatus(){(this.bird.getBounds().bottom>=this.config.height||this.bird.y<=0)&&this.gameOver()}createScore(){this.score=0,this.scoreText=this.add.text(20,20,"Score : 0",{fontSize:"32px",fill:"#000",fontStyle:"bold"});const e=localStorage.getItem("bestScore")||0;console.log(e),this.add.text(16,60,`Best Score : ${e}`,{fontSize:"18px",fill:"#000",fontStyle:"bold"})}placePipe(e,t){const s=this.getRightMostPipe(),i=n().Math.Between(...this.pipieVerticalDistanceRange),a=n().Math.Between(20,this.config.height-20-i),r=n().Math.Between(...this.pipieHorizontalDistanceRange);e.x=s+r+5*this.scoreStep,e.y=a,t.x=e.x,t.y=e.y+i}recyclePipes(){const e=[];this.pipes.getChildren().forEach((t=>{t.getBounds().right<=0&&(t.setVelocityX(this.pipeSpeed),e.push(t),2===e.length&&(this.placePipe(...e),this.increaseScore()))}))}getRightMostPipe(){let e=0;return this.pipes.getChildren().forEach((function(t){e=Math.max(t.x,e)})),e}gameOver(){this.physics.pause(),this.bird.setTint(16711680);const e=localStorage.getItem("bestScore"),t=e&&parseInt(e,10);"null"===e&&(this.bestScoreText=0),this.score>t&&localStorage.setItem("bestScore",this.score),this.add.text(...this.screenCenter,`Your Score : ${this.score}`,this.fontOptions).setOrigin(.5),this.createBack(),this.createRank(),this.init()}restartPlayerPosition(){alert("you have lost"),this.bird.x=this.config.startPosition.x,this.bird.y=this.config.startPosition.y,this.bird.body.velocity.y=0}flap(){this.bird.body.velocity.y=-this.flapVelocity}increaseScore(){this.score+=this.scoreStep,this.scoreText.setText(`Score : ${this.score}`),this.setDifficulty()}setDifficulty(){this.difficultyTable.forEach(((e,t)=>{e<this.score&&(this.prevStage!==t&&(this.pipeSpeed-=(t+1)*this.DIFFICULTY_STEP,this.prevStage=t,this.scoreStep+=2),this.pipeSpeed<-900&&(this.pipeSpeed+=(t+1)*this.DIFFICULTY_STEP))}))}changrStage(){}};class d extends n().Scene{constructor(e){super("PreloadScene"),this.config=e}preload(){this.load.image("sky_bg","assets/newSky.png"),this.load.spritesheet("Player","assets/birdSprite.png",{frameWidth:16,frameHeight:16}),this.load.image("Player2","assets/flappybird_2.png"),this.load.image("Player3","assets/flappybird_3.png"),this.load.image("rank","assets/rankBTN.png"),this.load.image("pipe","assets/pipe_skinny.png"),this.load.image("pause","assets/pause.png"),this.load.image("back","assets/back.png")}create(){this.scene.start("MenuScene")}}const u=d;const g=class extends r{constructor(e){super("ScoreScene",e),this.canGoBack=!0}create(){super.create();const e=localStorage.getItem("bestScore");if(this.add.text(...this.screenCenter,`Best Score: ${e||0}`,this.fontOptions).setOrigin(.5),this.canGoBack){this.add.image(this.config.width-30,this.config.height-22,"back").setOrigin(1).setScale(2.8).setInteractive().on("pointerup",(()=>{this.scene.start("MenuScene")}))}}},f={width:700,height:900,startPosition:{x:70,y:450}},y=[u,c,g,l,o],S=e=>new e(f),m={type:n().AUTO,...f,physics:{default:"arcade",arcade:{}},scene:y.map(S)};new(n().Game)(m)}},s={};function i(e){var n=s[e];if(void 0!==n)return n.exports;var a=s[e]={exports:{}};return t[e].call(a.exports,a,a.exports,i),a.exports}i.m=t,e=[],i.O=(t,s,n,a)=>{if(!s){var r=1/0;for(p=0;p<e.length;p++){for(var[s,n,a]=e[p],c=!0,o=0;o<s.length;o++)(!1&a||r>=a)&&Object.keys(i.O).every((e=>i.O[e](s[o])))?s.splice(o--,1):(c=!1,a<r&&(r=a));if(c){e.splice(p--,1);var h=n();void 0!==h&&(t=h)}}return t}a=a||0;for(var p=e.length;p>0&&e[p-1][2]>a;p--)e[p]=e[p-1];e[p]=[s,n,a]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={143:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var n,a,[r,c,o]=s,h=0;if(r.some((t=>0!==e[t]))){for(n in c)i.o(c,n)&&(i.m[n]=c[n]);if(o)var p=o(i)}for(t&&t(s);h<r.length;h++)a=r[h],i.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return i.O(p)},s=self.webpackChunkphaser_webpack=self.webpackChunkphaser_webpack||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var n=i.O(void 0,[736],(()=>i(494)));n=i.O(n)})();