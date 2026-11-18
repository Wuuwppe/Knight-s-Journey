import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import VictoryScene from './scenes/Victory';
import BootScene from './scenes/Boot';
import PauseScene from './scenes/Pause';
import DeathScene from './scenes/Death';
import StartScene from './scenes/Start';
import ControlsScene from './scenes/Controls';

new Phaser.Game(Object.assign(config, {
  scene: [BootScene, GameScene, VictoryScene, PauseScene, DeathScene, StartScene, ControlsScene],
}));
