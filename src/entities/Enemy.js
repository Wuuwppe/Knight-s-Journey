import Phaser from 'phaser';

export default class Enemy extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, speed, patrolTime, direction){
        super(scene, x, y, 'enemy', 'RUN-0.png');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.anims.play('enemy-run');

        this.setOrigin(0.5, 0.8);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(16,13);
        this.body.setOffset(8,11);

        this.speed = speed;
        this.direction = direction;
        this.body.setVelocityX(this.speed * this.direction);
        this.setFlipX(this.direction < 0);

        this.alive = true;

        this.patrolTime = patrolTime;
        this.timer = this.patrolTime;
    }

    die() {
        if (!this.alive) return;
        this.alive = false;
        this.body.setVelocityX(0);

        this.anims.play('enemy-death');

        this.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'enemy-death',
            () => {
                this.destroy();
            }
        );
    }

    update(delta){
        if (!this.alive) return;

        this.timer -= delta / 1000;
        if (this.timer <=0){
            this.direction *= -1;
            this.body.setVelocityX(this.speed * this.direction);
            this.setFlipX(this.direction<0);
            this.timer = this.patrolTime;
        }
    }
}