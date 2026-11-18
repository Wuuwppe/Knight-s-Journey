import MenuScene from "./Menu";

export default class Death extends MenuScene {
    constructor() {
        super('DeathScene');
    }

    create () {
        this.createMenu();

        this.add.bitmapText(243, 105, 'myFont', 'Game Over', 21).setTint(0x000);

        this.createButton(248, 170, 'RESTART', () => {
            this.scene.stop('DeathScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        });
        
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('DeathScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        })
    }
}