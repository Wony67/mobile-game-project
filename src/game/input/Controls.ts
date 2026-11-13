import Phaser from 'phaser';

type Direction = 'up' | 'down' | 'left' | 'right';

/** Keyboard and DOM touch controls share one input state. */
export class Controls {
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly fireKeys: Phaser.Input.Keyboard.Key[];
  private readonly held = new Map<number, Direction | 'fire'>();
  private readonly cleanup: (() => void)[] = [];

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error('Keyboard input is unavailable');
    this.cursors = keyboard.createCursorKeys();
    this.fireKeys = [keyboard.addKey('SPACE'), keyboard.addKey('Z')];
    document.querySelectorAll<HTMLButtonElement>('[data-move], #fire').forEach((button) => {
      const action = button.id === 'fire' ? 'fire' : button.dataset.move as Direction;
      const down = (event: PointerEvent) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        this.held.set(event.pointerId, action);
      };
      const up = (event: PointerEvent) => this.held.delete(event.pointerId);
      button.addEventListener('pointerdown', down);
      button.addEventListener('pointerup', up);
      button.addEventListener('pointercancel', up);
      button.addEventListener('lostpointercapture', up);
      this.cleanup.push(() => {
        button.removeEventListener('pointerdown', down);
        button.removeEventListener('pointerup', up);
        button.removeEventListener('pointercancel', up);
        button.removeEventListener('lostpointercapture', up);
      });
    });
    const reset = () => { this.held.clear(); keyboard.resetKeys(); };
    const visibility = () => { if (document.hidden) reset(); };
    window.addEventListener('blur', reset);
    document.addEventListener('visibilitychange', visibility);
    this.cleanup.push(() => window.removeEventListener('blur', reset),
      () => document.removeEventListener('visibilitychange', visibility));
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  private active(direction: Direction): boolean {
    return this.cursors[direction].isDown || [...this.held.values()].includes(direction);
  }

  get movement(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(Number(this.active('right')) - Number(this.active('left')),
      Number(this.active('down')) - Number(this.active('up'))).normalize();
  }

  get firing(): boolean {
    return this.fireKeys.some((key) => key.isDown) || [...this.held.values()].includes('fire');
  }

  private destroy(): void {
    this.cleanup.forEach((remove) => remove());
    this.held.clear();
    this.fireKeys.forEach((key) => key.destroy());
    Object.values(this.cursors).forEach((key) => key.destroy());
  }
}
