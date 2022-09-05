
import BaseScene from "./BaseScene";
import PlayScene from "./PlayScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);

    this.menu = [
      //scoreScene 설정
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem){
    const textGo = menuItem.textGo;
    textGo.setInteractive();
    
    //console.log(this);
    textGo.on('pointerover', () =>{
        textGo.setStyle({fill: '#ff0'});
    })

    textGo.on('pointerout', () =>{
        textGo.setStyle({fill: '#fff'});
    })


    // 일시정지 이후 다시할지 나갈지 여부
    textGo.on('pointerup', () =>{
        if(menuItem.scene && menuItem.text === "Continue"){
            this.scene.stop();
            this.scene.resume(menuItem.scene);
        }else{
            this.scene.stop("PlayScene");
            this.scene.start(menuItem.scene)
        }
    })
  }
}

export default PauseScene;
