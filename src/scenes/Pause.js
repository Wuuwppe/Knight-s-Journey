import MenuScene from "./Menu";

export default class Pause extends MenuScene {
    constructor() {
        super('PauseScene');
    }
    
    create() {
        this.createMenu();

        this.add.bitmapText(260, 95, 'myFont', 'Paused', 21).setTint(0x000);

        this.createButton(237, 125, 'CONTROLS', () => {
            this.scene.stop('PauseScene');
            this.scene.launch('ControlsScene', { fromScene: 'PauseScene' });
        })

        this.createButton(248, 154, 'RESTART', () => {
            this.scene.stop('PauseScene');
            this.scene.stop('GameScene');
            this.scene.start('GameScene');
        });

        this.createButton(250, 185, 'RESUME', () => {
            this.scene.stop('PauseScene');
            this.scene.resume('GameScene');
        })

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop('PauseScene');
            this.scene.resume('GameScene');
        })

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('PauseScene');
            this.scene.resume('GameScene');
        })
    }
}