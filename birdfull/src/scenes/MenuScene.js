
import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Play" },

      //scoreScene 설정
      { scene: "ScoreScene", text: "Score" },
      { scene : "RankScene", text : "Rank"},
      { scene: "null", text: "Exit" },
    ];
  }

  create() {
    super.create();

    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    //this.scene.start("PlayScene");
  }

  setupMenuEvents(menuItem){
    const textGo = menuItem.textGo;
    textGo.setInteractive();
    
    textGo.on('pointerover', () =>{
        textGo.setStyle({fill: '#ff0'});
    })

    textGo.on('pointerout', () =>{
        textGo.setStyle({fill: '#fff'});
    })


    textGo.on('pointerup', () =>{
        menuItem.scene && this.scene.start(menuItem.scene);

        //score 눌렀을때 실행
        // if (menuItem.text === "Score"){

        // }
          if (menuItem.text === "Exit") {
            //exit 눌렀을때 실행
            this.game.destroy(true);
          } 
    })

  }
}

export default MenuScene;
