import { createButton, createImageButton } from "../utils/uiUtils.js";
class BattleScene extends Phaser.Scene {
    constructor(){
        super({key:'BattleScene'});

        this.isFighting = false;
    }
    init(data){
        this.background = data.background; // 
        //this.EnemyMonsters = enemyMonsters;// the random monster you will face
    }
    preload(){

    }
    create(){
        this.add.image(400, 300, `${this.background}`)
        const fightButton = createButton(this, 700, 100, 'Fight', ()=>{
            fighting = true;
        })
        const backButton = createButton(this, 700, 50, "Back", ()=>{
            this.scene.start('GameScene')
        })
        // will need to be turned invisible until you or your monster dies
    }
    update(){
        if(this.isFighting === true){

        }
    }
}
export default BattleScene;