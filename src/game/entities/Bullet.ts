import Phaser from 'phaser';
import { BULLET_SPEED, GAME_WIDTH, SHOT_INTERVAL_MS } from '../settings';

export class Bullet extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    const graphic = scene.add.graphics();
    graphic.fillStyle(0xeabf72, 0.18).fillEllipse(0, 0, 34, 12);
    graphic.fillStyle(0xffd28a).fillRoundedRect(-13, -3, 26, 6, 3);
    graphic.fillStyle(0xfff5d7).fillRoundedRect(-4, -2, 17, 4, 2);
    this.add(graphic);
    scene.add.existing(this);
    this.setName('bullet');
  }

  advance(deltaSeconds: number): void {
    this.x += BULLET_SPEED * deltaSeconds;
    if (this.x - 17 > GAME_WIDTH) this.destroy();
  }
}

export class Weapon {
  private nextShot = 0;
  private bullets: Bullet[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { this.bullets = []; });
  }

  update(time: number, deltaSeconds: number, firing: boolean, x: number, y: number): void {
    this.bullets.forEach((bullet) => bullet.advance(deltaSeconds));
    this.bullets = this.bullets.filter((bullet) => bullet.active);
    if (firing && time >= this.nextShot) {
      this.bullets.push(new Bullet(this.scene, x + 30, y));
      this.nextShot = time + SHOT_INTERVAL_MS;
    }
  }
}
