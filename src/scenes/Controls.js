import MenuScene from "./Menu";

export default class Controls extends MenuScene {
    constructor() {
        super('ControlsScene');
    }

    init(data) {
        this.fromScene = data.fromScene;
    }

    create() {
        this.createMenu();

        this.add.bitmapText(259, 90, 'myFont', 'A - Left', 21).setTint(0x000);
        this.add.bitmapText(255, 107, 'myFont', 'D - Right', 21).setTint(0x000);
        this.add.bitmapText(233, 124, 'myFont', 'SPACE - Jump', 21).setTint(0x000);
        this.add.bitmapText(251, 141, 'myFont', 'E - Attack', 21).setTint(0x000);
        this.add.bitmapText(252, 158, 'myFont', 'W - Enter', 21).setTint(0x000);
        this.add.bitmapText(241, 173, 'myFont', 'ESC - Pause', 21).setTint(0x000);
        this.add.bitmapText(244, 190, 'myFont', 'Q - Defend', 21).setTint(0x000);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop('ControlsScene');
            if (this.fromScene === 'PauseScene'){
                this.scene.launch('PauseScene');
            } else {
                this.scene.launch('StartScene');
            }
        })
    }
}