import * as Phaser from 'phaser';
import AbstractCharacter, { AbstractCharacterData } from './abstractCharacter';
import BaseScene from '../../scenes/base.scene';
import Crop, { CropType } from '../crops/crop';
import GameConfig from 'src/app/utils/gameConfig';
import EnumHelper from 'src/app/utils/enumHelper';

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
  private readonly pKey: Phaser.Input.Keyboard.Key;
  private processPKeyDown = true;
  private processMiddleButtonDown = true;
  private isInPlantingMode = false;
  private selectedCrop: CropType = CropType.Tomato;
  private cropSelectionSprite: Phaser.GameObjects.Sprite;

  constructor(scene: BaseScene, data: PlayerData, registerAnimations = false) {
    super(scene, data.abstractCharacterData, registerAnimations);
    this.data = data;

    // Add listener on 'P' key (for planting mode)
    this.pKey = this.scene.input.keyboard.addKey('P');
    this.cropSelectionSprite = this.scene.add
      .sprite(0, 0, 'crops_picked')
      .setActive(false)
      .setVisible(false)
      .setDepth(GameConfig.map.aboveEverythingLayerDepth);
  }

  /**
   * Returns player's data (usually to be passed between scenes).
   */
  getData(): PlayerData {
    return this.data;
  }

  updatePlayer(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.processPKeyDown && this.pKey.isDown) {
      this.processPKeyDown = false;
      this.isInPlantingMode = !this.isInPlantingMode;
    } else if (this.pKey.isUp) {
      this.processPKeyDown = true;
    }

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

    if (this.isInPlantingMode) {
      // Display selected drop under mouse cursor
      const activePointer = this.scene.input.activePointer;

      this.cropSelectionSprite.setActive(true).setVisible(true).play(`${this.selectedCrop}_picked`, true);
      this.cropSelectionSprite.setPosition(activePointer.x, activePointer.y);

      // On middle click, cycle through different type of crops
      if (this.processMiddleButtonDown && activePointer.middleButtonDown()) {
        this.processMiddleButtonDown = false;
        this.selectedCrop = EnumHelper.getNextInEnum(CropType, this.selectedCrop);
      } else if (activePointer.middleButtonReleased()) {
        this.processMiddleButtonDown = true;
      }

      // On left click, plant crop at mouse position!
      if (this.scene.input.activePointer.leftButtonDown()) {
        // TODO: Make sure a crop can be planted here (has the right soil, no other beneath, etc...)
        this.scene.addToUpdateLoop(new Crop(this.scene, this.selectedCrop, activePointer.x, activePointer.y));
      }
    } else {
      this.cropSelectionSprite.setActive(false).setVisible(false);
    }

    super.update(time, delta);
  }
}
