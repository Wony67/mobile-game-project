import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../settings';

export function drawLandscape(scene: Phaser.Scene): void {
  const g = scene.add.graphics();
  g.fillGradientStyle(0x142333, 0x142333, 0x537579, 0x537579, 1);
  g.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  g.fillStyle(0xe7c899, 0.07).fillCircle(728, 153, 85);
  g.fillStyle(0xe7c899, 0.12).fillCircle(728, 153, 66);
  g.fillStyle(0xe7c899, 0.9).fillCircle(728, 153, 48);
  g.fillStyle(0x78918b, 0.16);
  [[55, 150, 220], [370, 105, 160], [810, 210, 270]].forEach(([x, y, w]) => g.fillEllipse(x, y, w, 14));
  const ridge = (color: number, points: number[]) => {
    g.fillStyle(color);
    g.fillPoints([new Phaser.Geom.Point(0, GAME_HEIGHT),
      ...points.reduce<Phaser.Geom.Point[]>((acc, value, index) => {
        if (index % 2 === 0) acc.push(new Phaser.Geom.Point(value, points[index + 1]));
        return acc;
      }, []), new Phaser.Geom.Point(GAME_WIDTH, GAME_HEIGHT)], true);
  };
  ridge(0x3b5861, [0, 338, 80, 293, 170, 322, 285, 217, 405, 328, 510, 278, 625, 331, 770, 251, 960, 334]);
  ridge(0x2a424e, [0, 395, 150, 359, 235, 390, 390, 309, 560, 404, 710, 347, 860, 382, 960, 354]);
  ridge(0x1b303d, [0, 471, 160, 442, 290, 472, 430, 425, 570, 464, 730, 421, 860, 450, 960, 421]);
  g.lineStyle(1, 0xeee1bf, 0.18).strokeRect(20, 20, 920, 500);
  const textStyle = { fontFamily: 'monospace', fontSize: '11px', color: '#b1c3c3', letterSpacing: 2 };
  scene.add.text(37, 37, 'TRAINING GROUND / 01', textStyle);
  scene.add.text(923, 37, '風  /  CALM', textStyle).setOrigin(1, 0);
  scene.add.text(37, 486, 'NO ENEMIES · FREE FLIGHT', textStyle);
  scene.add.text(923, 486, '960 × 540', textStyle).setOrigin(1, 0);
}
