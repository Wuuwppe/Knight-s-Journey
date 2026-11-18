import MenuScene from "./Menu";

export default class Victory extends MenuScene {
    constructor() {
        super('VictoryScene');
    }
    
    init(data) {
        this.finalCoins = data.coins;
        this.finalKills = data.kills;
        this.finalTime = data.time;
        // console.log('VictoryScene data:', data);
    }

    create() {
        this.createMenu();

        if (this.finalTime > 100){
            this.finalTime = 100;
        }
        this.score = this.finalCoins * 10 + this.finalKills * 10 + 100 - this.finalTime;

        this.add.bitmapText(243, 105, 'myFont', 'Final Score:', 21).setTint(0x000);
        this.add.bitmapText(287, 140, 'myFont', this.score, 21).setOrigin(0.5, 0.5).setTint(0x000);

        this.createButton(248, 170, 'RESTART', () => {
            this.scene.stop('VictoryScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('VictoryScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        })
    }
}