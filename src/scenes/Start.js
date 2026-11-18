import MenuScene from "./Menu";

export default class Start extends MenuScene {
    constructor() {
        super('StartScene');
    }
    create() {
        this.createMenu();

        this.createButton(260, 115, 'START', () => {
            this.scene.stop('StartScene');
            this.scene.resume('GameScene');
        });

        this.createButton(237, 155, 'CONTROLS', () => {
            this.scene.stop('StartScene');
            this.scene.launch('ControlsScene', { fromScene: 'StartScene' });
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.stop('StartScene');
            this.scene.resume('GameScene');
        })
    }
}