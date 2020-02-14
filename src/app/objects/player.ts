import * as Phaser from 'phaser';
import GameConstants from '../utils/gameConstants';
import AnimationHelper from '../utils/animationHelper';

export default class Player extends Phaser.GameObjects.Sprite {
  private readonly PLAYER_VELOCITY_X = 120;
  private readonly PLAYER_VELOCITY_Y = 120;

  private arcadeSprite: Phaser.Physics.Arcade.Sprite;
  private textureKey: string;

  constructor(scene: Phaser.Scene, textureKey: string) {
    super(scene, 100, 300, textureKey);
    this.textureKey = textureKey;

    this.arcadeSprite = this.scene.physics.add.sprite(100, 300, textureKey).setCollideWorldBounds(true);
    this.registerAnimations();
  }

  update(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left.isDown) {
      this.arcadeSprite.setVelocityX(this.PLAYER_VELOCITY_X * -1).play('left', true);
    } else if (cursors.right.isDown) {
      this.arcadeSprite.setVelocityX(this.PLAYER_VELOCITY_X).play('right', true);
    } else if (cursors.down.isDown) {
      this.arcadeSprite.setVelocityY(this.PLAYER_VELOCITY_Y).play('down', true);
    } else if (cursors.up.isDown) {
      this.arcadeSprite.setVelocityY(this.PLAYER_VELOCITY_Y * -1).play('up', true);
    } else {
      // No movement
      this.arcadeSprite.setVelocity(0);
      // TODO: 2020-02-14 Blockost Play idle animation
    }
  }

  private registerAnimations() {
    // Walk left
    let [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 9, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Walk right
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 11, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Walk up
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 8, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: 'up',
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Walk down
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 10, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: 'down',
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });
  }

  private updateAnimation(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {}
}
