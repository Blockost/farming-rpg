import * as Phaser from 'phaser';
import { GameEvent } from '../utils/gameEvent';

export default abstract class BaseScene extends Phaser.Scene {
  private customUpdateList: Phaser.GameObjects.GameObject[] = [];

  constructor(key: string, config?: Phaser.Types.Scenes.SettingsConfig) {
    super({ key, ...config });
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  init() {
    this.load.addListener('progress', () => {
      const progress = this.load.progress;
      if (!isNaN(progress)) {
        // TODO: 2020-02-05 Blockost Maybe add a progress bar somewhere?
        console.log(`Progress: ${progress * 100}%`);
      }
    });

    // Add listeners for custom objects to be updated and destroyed
    this.events.on(GameEvent.NEW_OBJECT_TO_UPDATE, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.push(object);
    });

    this.events.on(GameEvent.OBJECT_DESTROYED, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.splice(this.customUpdateList.indexOf(object), 1);
    });
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  preload() {}

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  create() {}

  /**
   * Child scenes overridding this method should call it before anything else.
   *
   * @param time the current time. Either a High Resolution Timer value if it comes from Request Animation
   * Frame, or Date.now using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based
   *  on the FPS rate.
   */
  update(time: number, delta: number) {
    this.customUpdateList.forEach((object) => object.update(time, delta));
  }
}
