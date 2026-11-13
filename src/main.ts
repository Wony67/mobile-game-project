import Phaser from 'phaser';
import { GameScene } from './game/scenes/GameScene';
import { GAME_HEIGHT, GAME_WIDTH } from './game/settings';
import './style.css';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#142333',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene],
});

if (import.meta.hot) import.meta.hot.dispose(() => game.destroy(true));

// Development-only inspection for browser smoke tests; absent from production builds.
if (import.meta.env.DEV) Object.assign(window, { __flightGame: game });
