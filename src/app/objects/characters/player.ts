import * as Phaser from 'phaser';
import AbstractCharacter, { AbstractCharacterData } from './abstractCharacter';
import BaseScene from '../../scenes/base.scene';

/**
 * Custom data for Player.
 */
export interface PlayerData {
  abstractCharacterData: AbstractCharacterData;
}

/**
 * Implementation of the controllable player in the game.
 */
export default class Player extends AbstractCharacter {
  private data: PlayerData;

  constructor(scene: BaseScene, data: PlayerData, registerAnimations = false) {
    super(scene, data.abstractCharacterData, registerAnimations);
    this.data = data;
  }

  /**
   * Returns player's data (usually to be passed between scenes).
   */
  getData(): PlayerData {
    return this.data;
  }

  updatePlayer(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left.isDown) {
      super.setMovement(true, false, false, false);
    } else if (cursors.right.isDown) {
      super.setMovement(false, true, false, false);
    } else if (cursors.down.isDown) {
      super.setMovement(false, false, false, true);
    } else if (cursors.up.isDown) {
      super.setMovement(false, false, true, false);
    } else {
      this.setMovement(false, false, false, false);
    }

    super.update(time, delta);
  }
}
