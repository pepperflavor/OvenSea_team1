
import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {

  constructor(config) {
super("ScoreScene", config)
    this.canGoBack = true;

  }

  create() {
    super.create();
    const bestScore = localStorage.getItem('bestScore');
    this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, this.fontOptions )
    .setOrigin(0.5);
  

  if(this.canGoBack){
    const backButton = this.add.image(this.config.width - 30, this.config.height - 22, "back")
    .setOrigin(1)
    .setScale(2.8)
    .setInteractive();

  backButton.on('pointerup', () =>{
    this.scene.start("MenuScene");
  })
  }


}
}

export default ScoreScene;
