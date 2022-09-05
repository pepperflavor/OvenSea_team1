import BaseScene from "./BaseScene";

class BacktoMenuScene extends BaseScene{

    constructor(config){
    super('BacktoMenuScene', {...config, canGoBack : true});
    }

    create(){
        super.create();
    }

}

export default BacktoMenuScene;