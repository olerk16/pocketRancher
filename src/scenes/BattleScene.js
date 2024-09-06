import { createButton, createImageButton } from "../utils/uiUtils.js";
class BattleScene extends Phaser.Scene {
    constructor(){
        super({key:'BattleScene'});

        this.isFighting = false;
        this.fightButton = null;
        this.backButton = null;
        this.playerMonster = null;
        this.enemyMonster = null;
        this.playerHealthBar = null;
        this.enemyHealthBar = null;
        this.moves = [];
        this.currentTurn = 'player';

    }
    init(data){
        this.background = data.background; // 
        this.enemyMonster = data.enemyMonster;// the random monster you will face
    }
    create(){
        this.add.image(400, 300, `${this.background}`)
        this.pickRandomMonster();
        this.addButtons();
        this.showEncounter();
    }
    update(){
        if(this.isFighting === true){
            this.pickMove();
        }
    }
    pickRandomMonster(){
        this.add.image(400, 300, `${this.enemyMonster.spriteKey}`).setScale(.5);
        // will show level, name, and more
    }
    showEncounter(){

    }
    pickMove(){
        if(this.currentTurn == 'player'){
            // show moves
        }

    }
    
    startFight(){
        // get rid of the button 
        this.fightButton.setVisible(false)
        this.backButton.setVisible(false);
        
        // place the monsters in the correct pos

        // add the health bars, moves, description of move

        //goes into the
        this.isFighting = true;
        console.log("fight start");
    }
    addButtons(){
        this.fightButton = createButton(this, 700, 100, 'Fight', () =>{
            this.startFight();
        });
        this.backButton = createButton(this, 700, 50, "Back", ()=>{
            this.scene.start('GameScene')
        })
    }
}
export default BattleScene;