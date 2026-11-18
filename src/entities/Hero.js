import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

export default class Hero extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y){
        super(scene, x, y, 'character', 'IDLE-0.png');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.anims.play('character-idle');

        this.setOrigin(0.5, 0.6);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(18,32);
        this.body.setOffset(39,29);
        this.body.setMaxVelocity(200, 400)
        this.body.setDragX(2000);

        this.attackHitbox = this.scene.add.rectangle(this.x, this.y, 30, 5);
        this.scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.setAllowGravity(false);

        this.maxHP = 3;
        this.hp = this.maxHP;

        this.keys = scene.cursorKeys;
        this.inputState = {};

        this.inAnimation = false;
        this.iframes = false;
        this.animLocked = false;
        this.dying = false;
        
        // console.log('Attack hitbox created:', this.attackHitbox);
        this.setupAnimations();
        this.setupMovement();
    }

    setupAnimations(){
        this.animState = new StateMachine({
            init: 'idle',
            transitions: [
                { name: 'idle', from: ['falling', 'running', 'attacking', 'defending', 'hurting', 'doublejumping', 'jumping', 'dying'], to: 'idle'},
                { name: 'run', from: ['falling', 'idle', 'attacking', 'defending', 'hurting', 'doublejumping', 'jumping'], to: 'running'},
                { name: 'jump', from: ['idle', 'running', 'attacking', 'defending', 'hurting', 'falling'], to: 'jumping'},
                { name: 'doublejump', from: ['falling', 'jumping'], to: 'doublejumping'},
                { name: 'fall', from: ['idle', 'running', 'attacking', 'defending', 'doublejumping', 'jumping', 'hurting'], to: 'falling'},
                { name: 'attack', from: ['idle', 'running', 'defending', 'hurting'], to: 'attacking'},
                { name: 'defend', from: ['idle', 'running', 'attacking', 'hurting'], to: 'defending'},
                { name: 'hurt', from: ['idle', 'running', 'attacking', 'falling', 'jumping', 'doublejumping', 'defending'], to: 'hurting'},
                { name: 'death', from: ['idle', 'running', 'attacking', 'falling', 'jumping', 'doublejumping', 'defending'], to: 'dying'},

            ],
            methods: {
                onEnterState:(lifecycle) => {
                    this.anims.play('character-' +lifecycle.to);
                    // console.log(lifecycle);
                    if (lifecycle.to === 'attacking'){
                        this.inAnimation = true;
                        this.body.setVelocityX(0);

                        this.attackHitbox.body.setEnable(true);

                        this.scene.physics.overlap(this.attackHitbox, this.scene.enemies, (hitbox, enemy) => {
                            enemy.die();
                            this.scene.enemyKilled();
                        })

                        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'character-attacking', () =>{
                            this.inAnimation = false;
                        });
                    }
                    if (lifecycle.to === 'defending'){
                        this.inAnimation = true;
                        this.body.setVelocityX(0);
                        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'character-defending', () =>{
                            this.inAnimation = false;
                        });
                    }
                },
            },
        });

        this.animPredicates = {
            idle: () => {
                return this.body.onFloor() && this.body.velocity.x === 0 && Math.abs(this.body.velocity.y) < 1;
            },
            run: () => {
                return this.body.onFloor() && Math.abs(this.body.velocity.y) < 1 && (
                    (this.flipX && this.body.velocity.x < -10) ||
                    (!this.flipX && this.body.velocity.x > 10)
                );
            },
            jump: () => {
                return this.body.velocity.y <0 && !this.inAnimation;
            },
            doublejump: () => {
                return this.body.velocity.y <0 && this.moveState.is('doublejumping') ;
            },
            fall: () => {
                return !this.body.onFloor()&& this.body.velocity.y >0;
            },
            attack: () => {
                return this.inputState.didPressAttack;
            },
            defend: () => {
                return this.inputState.didPressDefend;
            },
        };
    }

    setupMovement(){
        this.moveState = new StateMachine({
            init: 'standing',
            transitions: [
                { name: 'jump', from: 'standing', to: 'jumping' },
                { name: 'doublejump', from: 'jumping', to: 'doublejumping' },
                { name: 'fall', from: 'standing', to: 'falling' },
                { name: 'touchdown', from: ['jumping', 'doublejumping', 'falling', 'dying'], to: 'standing'},
                { name: 'death', from: ['jumping', 'doublejumping', 'falling', 'standing'], to: 'dying'},
            ],
            methods: {
                onJump: () => {
                    this.body.setVelocityY(-330);
                },
                onDoublejump: () => {
                    this.body.setVelocityY(-300);
                },
                onDeath: () => {
                    this.body.setVelocity(0,0);
                    this.body.setAcceleration(0);
                }
            }
        });
        this.movePredicates = {
            jump: () => {
                return this.inputState.didPressJump && !this.inAnimation;
            },
            doublejump: () => {
                return this.inputState.didPressJump;
            },
            fall: () => {
                return !this.body.onFloor();
            },
            touchdown: () => {
                return this.body.onFloor() && this.body.velocity.y >= 0;
            },
        };
    }

    takeDamage(amount = 1){
        if (this.isDead() || this.iframes) return;
        if (this.animState.is('attacking') || this.animState.is('defending')) {
            this.inAnimation = false;
            this.animLocked = false;
        }
        this.hp -= amount;

        this.scene.updateHpBar(this.hp);

        if (this.hp < 1) {
            this.kill();
        } else{
            if (this.animState.can('hurt')){
                this.setIframes(1000);
                this.animLocked = true;
                this.animState.hurt();
                this.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'character-hurting', () =>{
                        this.animLocked = false;
                    });
            }
        }
    }
    setIframes(duration) {
        this.iframes = true;
        this.scene.time.delayedCall(duration, () => {
            this.iframes = false;
        })
    }

    kill() {
        if (this.moveState.can('death')){
            this.moveState.death();
            this.animState.death();
            this.dying = true;
            }
        }

    isDead() {
        return this.moveState.is('dying');
    }

    preUpdate(time, delta){
        super.preUpdate(time,delta);
        
        if (this.dying) return;

        if (this.attackHitbox){
            this.attackHitbox.x = this.flipX ? this.x - 24 : this.x + 25;
            this.attackHitbox.y = this.y;
        }

        this.inputState.didPressJump = !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.jump);
        this.inputState.didPressAttack = !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.attack);
        this.inputState.didPressDefend = !this.isDead() && Phaser.Input.Keyboard.JustDown(this.keys.defend);

        if (!this.inAnimation){
            if (!this.isDead() && this.keys.left.isDown){
                this.body.setAccelerationX(-2000);
                this.setFlipX(true);
                this.body.offset.x=40;
            } else if (!this.isDead() && this.keys.right.isDown){
                this.body.setAccelerationX(2000);
                this.setFlipX(false);
                this.body.offset.x=39;
            } else{
                this.body.setAccelerationX(0);
            }
        }else{
            this.body.setAccelerationX(0);
        }
        
        if (this.moveState.is('jumping') || this.moveState.is('doublejumping')){
            if (!this.keys.jump.isDown && this.body.velocity.y <-100){
                this.body.setVelocityY(-100);
            }
        }

        for (const t of this.moveState.transitions()){
            if (t in this.movePredicates && this.movePredicates[t]()){
                this.moveState[t]();
                break;
            }
        }

        if (!this.inAnimation && !this.animLocked) {
            for (const t of this.animState.transitions()) {
                if (t in this.animPredicates && this.animPredicates[t]()) {
                    this.animState[t]();
                    break;
                }
            }
        }
    }
}