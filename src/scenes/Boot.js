import Phaser from "phaser";

export default class Boot extends Phaser.Scene {
    constructor() {
        super ({ key: 'BootScene' });
    }

    preload() {
        this.load.bitmapFont('myFont', 'assets/fonts/myFont_0.png', 'assets/fonts/myFont.fnt');
        this.load.atlas('character', 'assets/characters/Character.png', 'assets/characters/Character.json');
        this.load.atlas('enemy', 'assets/characters/Enemy.png', 'assets/characters/Enemy.json')
        this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.tmj');
        this.load.image('world-sheet', 'assets/tilesets/world.png');
        this.load.image('clouds-sheet', 'assets/tilesets/clouds.png');
        this.load.spritesheet('anim-tiles-sheet', 'assets/tilesets/animated_tiles.png', {frameWidth:32, frameHeight:32});
        this.load.image('bg-layer1', 'assets/backgrounds/layer1.png');
        this.load.image('bg-layer2', 'assets/backgrounds/layer2.png');
        this.load.image('bg-layer3', 'assets/backgrounds/layer3.png');
        this.load.image('bg-layer4', 'assets/backgrounds/layer4.png');
        this.load.image('bg-layer5', 'assets/backgrounds/layer5.png');
        this.load.spritesheet('hp-sheet', 'assets/ui/hp.png', {frameWidth:128, frameHeight:32});
        this.load.spritesheet('menu', 'assets/ui/menu.png', {frameWidth:32, frameHeight:32});
    }
    
    create() {
        this.anims.create({
        key: 'character-idle',
        repeat: -1,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'IDLE-',
            start: 0,
            end: 6,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-running',
        repeat: -1,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'RUN-',
            start: 0,
            end: 7,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-jumping',
        repeat: 0,
        frames: this.anims.generateFrameNames('character', {
            frames: ['JUMP-0.png']
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-doublejumping',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'DOUBLEJUMP-',
            start: 0,
            end: 2,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-attacking',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'ATTACK-',
            start: 0,
            end: 5,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-falling',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'FALL-',
            start: 0,
            end: 1,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-defending',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'DEFEND-',
            start: 0,
            end: 5,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-dying',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'DEATH-',
            start: 0,
            end: 11,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'character-hurting',
        repeat: 0,
        frames: this.anims.generateFrameNames('character',{
            prefix: 'HURT-',
            start: 0,
            end: 3,
            suffix: '.png',
        }),
        frameRate:10,
        });

        this.anims.create({
        key: 'enemy-run',
        repeat: -1,
        frames: this.anims.generateFrameNames('enemy',{
            prefix: 'RUN-',
            start: 0,
            end: 5,
            suffix: '.png',
        }),
        frameRate:10,
        })

        this.anims.create({
        key: 'enemy-death',
        repeat: 0,
        frames: this.anims.generateFrameNames('enemy',{
            prefix: 'DEATH-',
            start: 0,
            end: 4,
            suffix: '.png',
        }),
        frameRate:10,
        })

        this.anims.create({
        key: 'water-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', { 
            start: 0, 
            end: 14
        }),
        frameRate: 10,
        repeat: -1
        });

        this.anims.create({
        key: 'portal1-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', { 
            start: 15, 
            end: 24
        }),
        frameRate: 10,
        repeat: -1
        });

        this.anims.create({
        key: 'portal2-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', { 
            start: 25, 
            end: 34
        }),
        frameRate: 10,
        repeat: -1
        });

        this.anims.create({
        key: 'portal3-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', { 
            start: 35, 
            end: 44
        }),
        frameRate: 10,
        repeat: -1
        });

        this.anims.create({
        key: 'portal4-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', { 
        start: 45, 
        end: 54
        }),
        frameRate: 10,
        repeat: -1
        });

        this.anims.create({
        key: 'coin-anim',
        frames: this.anims.generateFrameNumbers('anim-tiles-sheet', {
            start: 55,
            end: 58
        }),
        frameRate: 10,
        repeat: -1
        })

        this.scene.start('GameScene');
        this.scene.pause('GameScene');
        this.scene.launch('StartScene');
        // this.scene.start('VictoryScene');
    }
}