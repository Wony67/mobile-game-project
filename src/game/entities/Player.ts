import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SPEED } from '../settings';

export class Player extends Phaser.GameObjects.Container {
  readonly halfWidth = 27;
  readonly halfHeight = 24;

  constructor(scene: Phaser.Scene) {
    super(scene, 150, GAME_HEIGHT / 2);
    const g = scene.add.graphics();
    // Original flying swordsman silhouette, created entirely from primitives.
    g.fillStyle(0xe9b78d).fillCircle(5, -13, 8);
    g.fillStyle(0x283a4d).fillRoundedRect(-4, -22, 19, 8, 3);
    g.fillStyle(0xe66e50).fillTriangle(-5, -10, -27, -7, -20, 3);
    g.fillStyle(0xe66e50).fillTriangle(-7, -5, -23, 7, -13, 6);
    g.fillStyle(0xe9dec7).fillTriangle(0, -6, -13, 14, 15, 10);
    g.fillStyle(0x567c84).fillTriangle(-10, 10, -19, 23, 4, 16);
    g.fillStyle(0x334d64).fillTriangle(2, 11, 17, 22, 12, 8);
    g.lineStyle(3, 0xf7dfb4).lineBetween(9, 0, 26, -5);
    g.lineStyle(3, 0xd17a4f).lineBetween(12, -7, 15, 4);
    this.add(g);
    scene.add.existing(this);
    this.setName('player');
  }

  move(direction: Phaser.Math.Vector2, deltaSeconds: number): void {
    this.x = Phaser.Math.Clamp(this.x + direction.x * PLAYER_SPEED * deltaSeconds,
      this.halfWidth, GAME_WIDTH - this.halfWidth);
    this.y = Phaser.Math.Clamp(this.y + direction.y * PLAYER_SPEED * deltaSeconds,
      this.halfHeight, GAME_HEIGHT - this.halfHeight);
  }
}
