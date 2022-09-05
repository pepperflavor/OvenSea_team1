import Phaser from "phaser";

class PreloadScene extends Phaser.Scene{
    constructor(config){
        super('PreloadScene');
        this.config = config;
    }

    preload(){
            this.load.image("sky_bg", "assets/newSky.png");

            //this.load.image("Player", "assets/bird.png");

            // this.load.spritesheet(
            //   "Player",
            //   "assets/bird_150-removebg-preview.png",
            //   {
            //     frameWidth: 150,
            //     frameHeight: 150,
            //     // spacing: 20,
            //   }
            // );
            
            // blueBird
            this.load.spritesheet(
              "Player", "assets/birdSprite.png",{
                frameWidth: 16,
                frameHeight: 16,
              }
            )

            this.load.image(
              "Player2",
              "assets/flappybird_2.png",
            );
            this.load.image(
              "Player3",
              "assets/flappybird_3.png",
            );

            this.load.image(
              "rank",
              "assets/rankBTN.png",
            )
            this.load.image("pipe", "assets/pipe_skinny.png");
            this.load.image("pause", "assets/pause.png");
            this.load.image("back", "assets/back.png")
    }

    create(){
        this.scene.start('MenuScene');

    }

}

export default PreloadScene;