import Phaser, { Physics } from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  scale: {
    width: 576,
    height: 320,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 750},
      debug: false,
      debugShowVelocity: true,
      debugShowBody:true,
      debugShowStaticBody: true,
    }
  },
};
