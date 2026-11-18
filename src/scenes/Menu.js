import Phaser from "phaser";

export default class Menu extends Phaser.Scene {
    constructor(key) {
        super({ key });
    }
    createMenu() {
        this.add.image(240, 76, 'menu', 0);
        this.add.image(272, 76, 'menu', 1);
        this.add.image(304, 76, 'menu', 2);
        this.add.image(336, 76, 'menu', 3);
        this.add.image(240, 108, 'menu', 7);
        this.add.image(272, 108, 'menu', 8);
        this.add.image(304, 108, 'menu', 9);
        this.add.image(336, 108, 'menu', 10);
        this.add.image(240, 140, 'menu', 14);
        this.add.image(272, 140, 'menu', 15);
        this.add.image(304, 140, 'menu', 16);
        this.add.image(336, 140, 'menu', 17);
        this.add.image(240, 172, 'menu', 21);
        this.add.image(272, 172, 'menu', 22);
        this.add.image(304, 172, 'menu', 23);
        this.add.image(336, 172, 'menu', 24);
        this.add.image(240, 204, 'menu', 28);
        this.add.image(272, 204, 'menu', 29);
        this.add.image(304, 204, 'menu', 30);
        this.add.image(336, 204, 'menu', 31);
    }

    createButton (x, y, label, callback) {
        const button = this.add.bitmapText(x, y, 'myFont', label, 21).setTint(0x000);
        button.setInteractive({ useHandCursor: true});
        button.on('pointerover', () => button.setTint(0xFFFFFF));
        button.on('pointerout', () => button.setTint(0x000));
        button.on('pointerdown', callback);
        return button;
    }
}