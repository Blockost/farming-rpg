import * as Phaser from 'phaser';
import AnimationHelper from '../utils/animationHelper';
import { FacingDirection } from '../utils/facingDirection';

export default class Player extends Phaser.GameObjects.Sprite {
  private readonly PLAYER_VELOCITY_X = 120;
  private readonly PLAYER_VELOCITY_Y = 120;
  private readonly ANIMATION_WALK_LEFT = 'WALK_LEFT';
  private readonly ANIMATION_IDLE_LEFT = 'IDLE_LEFT';
  private readonly ANIMATION_WALK_RIGHT = 'WALK_RIGHT';
  private readonly ANIMATION_IDLE_RIGHT = 'IDLE_RIGHT';
  private readonly ANIMATION_WALK_UP = 'WALK_UP';
  private readonly ANIMATION_IDLE_UP = 'IDLE_UP';
  private readonly ANIMATION_WALK_DOWN = 'WALK_DOWN';
  private readonly ANIMATION_IDLE_DOWN = 'IDLE_DOWN';

  private arcadeSprite: Phaser.Physics.Arcade.Sprite;
  private textureKey: string;
  private facingDirection: FacingDirection = FacingDirection.DOWN;

  constructor(scene: Phaser.Scene, textureKey: string) {
    super(scene, 100, 300, textureKey);
    this.textureKey = textureKey;

    this.arcadeSprite = this.scene.physics.add.sprite(100, 300, textureKey).setCollideWorldBounds(true);
    this.registerAnimations();
  }

  update(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (cursors.left.isDown) {
      this.moveLeft();
    } else if (cursors.right.isDown) {
      this.moveRight();
    } else if (cursors.down.isDown) {
      this.moveDown();
    } else if (cursors.up.isDown) {
      this.moveUp();
    } else {
      // No movement, go idle
      this.arcadeSprite.setVelocity(0);
      this.idle();
    }
  }

  private moveLeft() {
    this.arcadeSprite.setVelocityX(this.PLAYER_VELOCITY_X * -1).play(this.ANIMATION_WALK_LEFT, true);
    this.facingDirection = FacingDirection.LEFT;
  }

  private moveRight() {
    this.arcadeSprite.setVelocityX(this.PLAYER_VELOCITY_X).play(this.ANIMATION_WALK_RIGHT, true);
    this.facingDirection = FacingDirection.RIGHT;
  }

  private moveUp() {
    this.arcadeSprite.setVelocityY(this.PLAYER_VELOCITY_Y * -1).play(this.ANIMATION_WALK_UP, true);
    this.facingDirection = FacingDirection.UP;
  }

  private moveDown() {
    this.arcadeSprite.setVelocityY(this.PLAYER_VELOCITY_Y).play(this.ANIMATION_WALK_DOWN, true);
    this.facingDirection = FacingDirection.DOWN;
  }

  private idle() {
    switch (this.facingDirection) {
      case FacingDirection.LEFT:
        this.arcadeSprite.play(this.ANIMATION_IDLE_LEFT);
        break;

      case FacingDirection.RIGHT:
        this.arcadeSprite.play(this.ANIMATION_IDLE_RIGHT);
        break;

      case FacingDirection.UP:
        this.arcadeSprite.play(this.ANIMATION_IDLE_UP);
        break;

      case FacingDirection.DOWN:
        this.arcadeSprite.play(this.ANIMATION_IDLE_DOWN);
        break;

      default:
        throw new Error(`Unsupported facing direction ${this.facingDirection}`);
    }
  }

  private registerAnimations() {
    // Walk left
    let [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 9, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: this.ANIMATION_WALK_LEFT,
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Idle left
    this.scene.anims.create({
      key: this.ANIMATION_IDLE_LEFT,
      frames: [{ key: this.textureKey, frame: startIndex - 1 }],
      frameRate: 10
    });

    // Walk right
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 11, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: this.ANIMATION_WALK_RIGHT,
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Idle Right
    this.scene.anims.create({
      key: this.ANIMATION_IDLE_RIGHT,
      frames: [{ key: this.textureKey, frame: startIndex - 1 }],
      frameRate: 10
    });

    // Walk up
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 8, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: this.ANIMATION_WALK_UP,
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Idle left
    this.scene.anims.create({
      key: this.ANIMATION_IDLE_UP,
      frames: [{ key: this.textureKey, frame: startIndex - 1 }],
      frameRate: 10
    });

    // Walk down
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes({ rowStart: 10, length: 7, offsetStart: 1 });
    this.scene.anims.create({
      key: this.ANIMATION_WALK_DOWN,
      frames: this.scene.anims.generateFrameNumbers(this.textureKey, {
        start: startIndex,
        end: endIndex
      }),
      repeat: -1,
      frameRate: 10
    });

    // Idle left
    this.scene.anims.create({
      key: this.ANIMATION_IDLE_DOWN,
      frames: [{ key: this.textureKey, frame: startIndex - 1 }],
      frameRate: 10
    });
  }

  private updateAnimation(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {}
}
