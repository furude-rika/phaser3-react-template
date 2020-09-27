import Phaser, { Game } from 'phaser';
import { GameScene } from './phaser/GameScene';
import { gameField } from './phaser/constants';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  scale: {
    mode: Phaser.Scale.ENVELOP,
    autoRound: true,
    parent: 'phaser-example',
    width: gameField.width,
    height: gameField.height,
    min: {
      width: 400,
      height: gameField.height,
    },
    max: {
      width: gameField.width,
      height: gameField.width,
    },
  },
  scene: GameScene,
};

const game = new Game(config);
