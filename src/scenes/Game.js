import Phaser from 'phaser';
import Hero from '../entities/Hero';
import Enemy from '../entities/Enemy';

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(data) {    
    this.cursorKeys = this.input.keyboard.addKeys({
      enter: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attack: Phaser.Input.Keyboard.KeyCodes.E,
      defend: Phaser.Input.Keyboard.KeyCodes.Q,
      pause: Phaser.Input.Keyboard.KeyCodes.ESC,
    });
    this.addMap();

    this.addHero();

    this.hpBar = this.add.image(10, 0, 'hp-sheet', 0).setOrigin(0,0).setScrollFactor(0).setDepth(10);

    this.coins = 0;
    this.coinsIcon = this.add.image(-10,11, 'anim-tiles-sheet', 55).setOrigin(0,0).setScrollFactor(0).setDepth(10).setScale(2);
    this.coinsText = this.add.bitmapText(36, 36, 'myFont', this.coins, 21).setScrollFactor(0).setDepth(10).setTint(0x000);

    this.kills = 0;
    this.killsIcon = this.add.image(5, 50, 'enemy', 'RUN-0.png').setOrigin(0,0).setScrollFactor(0).setDepth(10);
    this.killsText = this.add.bitmapText(36, 58, 'myFont', this.kills, 21).setScrollFactor(0).setDepth(10).setTint(0x000);

    this.elapsedTime = 0; 
    this.timerText = this.add.bitmapText(10, 81, 'myFont', '00:00', 21).setScrollFactor(0).setDepth(10).setTint(0x000); 
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.elapsedTime++;
        let minutes = Math.floor(this.elapsedTime / 60);
        let seconds = this.elapsedTime % 60;

        let formatTime = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
        this.timerText.setText(formatTime);
      },
      loop: true
    })

    const pause = this.add.image(565, 10, 'menu', 25).setScrollFactor(0,0);
    pause.setInteractive({ useHandCursor: true });
    pause.on('pointerdown', () => {
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
    
    this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
  }

  addHero() {
    this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);

    this.cameras.main.startFollow(this.hero);
    this.physics.add.collider(this.hero, this.map.getLayer('Ground').tilemapLayer);
    this.hero.setDepth(11);

    this.physics.add.overlap(this.hero, this.trapGroup, () => {
      this.hero.takeDamage(3);
    })

    this.physics.add.overlap(this.hero, this.coinGroup, (hero, coin) => {
      coin.destroy();
      this.coins += 1;
      this.coinsText.setText(this.coins);
    })

    this.enemies.forEach(enemy => {
      this.physics.add.overlap(this.hero, enemy, () => {
        this.hero.takeDamage();
      });
    });
    this.physics.add.overlap(this.hero, this.portalGroup, () => {
      if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.enter)){
        this.scene.pause();
        this.scene.launch('VictoryScene', {
          coins: this.coins,
          kills: this.kills,
          time: this.elapsedTime
        });
      }
    })
  }

  addMap(){
    this.map = this.make.tilemap({ key: 'level-1'});
    const groundTiles = this.map.addTilesetImage('world', 'world-sheet');
    const backgroundTiles = this.map.addTilesetImage('clouds', 'clouds-sheet');

    this.bgLayers = [];
    this.bgLayers.push(this.add.tileSprite(0,0, this.cameras.main.width, this.cameras.main.height, 'bg-layer5').setOrigin(0,0).setScrollFactor(0));
    this.bgLayers.push(this.add.tileSprite(0,0, this.cameras.main.width, this.cameras.main.height, 'bg-layer4').setOrigin(0,0).setScrollFactor(0));

    const backgroundLayer = this.map.createLayer('Background', backgroundTiles);
    backgroundLayer.setScrollFactor(0.1);

    this.bgLayers.push(this.add.tileSprite(0,0, this.cameras.main.width, this.cameras.main.height, 'bg-layer3').setOrigin(0,0).setScrollFactor(0));
    this.bgLayers.push(this.add.tileSprite(0,0, this.cameras.main.width, this.cameras.main.height, 'bg-layer2').setOrigin(0,0).setScrollFactor(0));
    this.bgLayers.push(this.add.tileSprite(0,0, this.cameras.main.width, this.cameras.main.height, 'bg-layer1').setOrigin(0,0).setScrollFactor(0));
    
    const groundLayer = this.map.createLayer('Ground', groundTiles);
    groundLayer.setCollisionByProperty({ collides: true});

    const foregroundLayer = this.map.createLayer('Foreground',groundTiles);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);

    this.trapGroup = this.physics.add.group( { immovable: true, allowGravity: false});
    this.portalGroup = this.physics.add.group( { immovable: true, allowGravity: false});
    this.coinGroup = this.physics.add.group( { immovable: true, allowGravity: false});

    this.enemies = [];

    this.map.getObjectLayer('Objects').objects.forEach(object => {
      if (object.name === 'Start') {
        this.spawnPos = { x: object.x, y: object.y};
      }
      if (object.name === 'water'){
        const trap = this.trapGroup.create(object.x, object.y, 'anim-tiles-sheet', 0);
        trap.setOrigin(0,1);
        trap.setSize(object.width, object.height-6);
        trap.setOffset(0,6);
        trap.play('water-anim');
      }

      let enemy = null;

      if (object.name === 'Enemy1') {
        enemy = new Enemy(this, object.x, object.y, 50, 3.2, 1);
      }
      if (object.name === 'Enemy2') {
        enemy = new Enemy(this, object.x, object.y, 80, 2.8, -1);
      }
      if (object.name === 'Enemy3') {
        enemy = new Enemy(this, object.x, object.y, 70, 3, 1);
      }
      if (object.name === 'Enemy4') {
        enemy = new Enemy(this, object.x, object.y, 50, 4, -1);
      }
      if (object.name === 'Enemy5') {
        enemy = new Enemy(this, object.x, object.y, 80, 0.7, -1);
      }
      if (enemy) {
        this.physics.add.collider(enemy, this.map.getLayer('Ground').tilemapLayer);
        enemy.setDepth(6);
        this.enemies.push(enemy);
      }

      if (object.name === 'portal1') {
        const portal = this.portalGroup.create(object.x, object.y, 'anim-tiles-sheet', 15);
        portal.setOrigin(0,1);
        portal.setSize(object.width-22, object.height-17);
        portal.setOffset(22,17);
        portal.play('portal1-anim');
      }
      if (object.name === 'portal2') {
        const portal = this.portalGroup.create(object.x, object.y, 'anim-tiles-sheet', 25);
        portal.setOrigin(0,1);
        portal.setSize(object.width-21, object.height-17);
        portal.setOffset(0,17);
        portal.play('portal2-anim');
      }
      if (object.name === 'portal3') {
        const portal = this.portalGroup.create(object.x, object.y, 'anim-tiles-sheet', 35);
        portal.setOrigin(0,1);
        portal.setSize(object.width-10, object.height);
        portal.setOffset(10,0);
        portal.play('portal3-anim');
      }
      if (object.name === 'portal4') {
        const portal = this.portalGroup.create(object.x, object.y, 'anim-tiles-sheet', 45);
        portal.setOrigin(0,1);
        portal.setSize(object.width-10, object.height);
        portal.setOffset(0,0);
        portal.play('portal4-anim');
      }
      if (object.name === 'coin') {
        const coin = this.coinGroup.create(object.x, object.y, 'anim-tiles-sheet', 55);
        coin.setOrigin(0,1);
        coin.setSize(11, 11);
        coin.setOffset(11,11);
        coin.play('coin-anim');
    }

      this.trapGroup.children.iterate(obj => obj.setDepth(1));
      this.portalGroup.children.iterate(obj => obj.setDepth(2));
      groundLayer.setDepth(4);
      foregroundLayer.setDepth(5);
    })

    // const debugGraphics = this.add.graphics();
    // groundLayer.renderDebug(debugGraphics);
    // console.log(this.textures.get('water-sheet').getFrameNames());
  }

  updateHpBar(currentHp) {
    if (currentHp === 3){
      this.hpBar.setFrame(0);
    } else if(currentHp === 2){
      this.hpBar.setFrame(1);
    } else if(currentHp === 1){
      this.hpBar.setFrame(2);
    } else {
      this.hpBar.setFrame(3);
    }
  }

  enemyKilled (){
    this.kills += 1;
    this.killsText.setText(this.kills);
  }

  update(time, delta) {
    const cam = this.cameras.main;
    this.bgLayers[4].tilePositionX = cam.scrollX * 0.8;
    this.bgLayers[3].tilePositionX = cam.scrollX * 0.5;
    this.bgLayers[2].tilePositionX = cam.scrollX * 0.3;
    this.bgLayers[1].tilePositionX = cam.scrollX * 0.1;
    this.bgLayers[0].tilePositionX = cam.scrollX * 0;

    this.enemies.forEach(enemy => enemy.update(delta));

    if (this.hero.isDead()){
      this.hero.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'character-dying', () => {
        this.scene.pause();
        this.scene.launch('DeathScene');
      });
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.pause)){
      this.scene.pause();
      this.scene.launch('PauseScene');
    }
  }
}