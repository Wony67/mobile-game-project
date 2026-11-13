import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Weapon } from '../entities/Bullet';
import { Controls } from '../input/Controls';
import { drawLandscape } from './landscape';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private weapon!: Weapon;

  constructor() { super('flight'); }

  create(): void {
    drawLandscape(this);
    this.player = new Player(this);
    this.controls = new Controls(this);
    this.weapon = new Weapon(this);
  }

  update(time: number, delta: number): void {
    // Avoid teleporting after a suspended tab resumes.
    const seconds = Math.min(delta, 50) / 1000;
    this.player.move(this.controls.movement, seconds);
    this.weapon.update(time, seconds, this.controls.firing, this.player.x, this.player.y);
  }
}
