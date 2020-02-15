import * as Phaser from 'phaser';
import AnimationHelper from '../utils/animationHelper';
import FacingDirection from '../utils/facingDirection';
import GameConstants from '../utils/gameConstants';
import TiledSpawnPoint from './tiled/tiledSpawnPoint';

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

  private readonly PLAYER_BBOX_WIDTH = 20;
  private readonly PLAYER_BBOX_HEIGHT = 10;

  private arcadeSprite: Phaser.Physics.Arcade.Sprite;
  private textureKey: string;
  private facingDirection: FacingDirection = FacingDirection.DOWN;

  constructor(scene: Phaser.Scene, textureKey: string, spawnPoint: TiledSpawnPoint) {
    super(scene, spawnPoint.x, spawnPoint.y, textureKey);
    this.textureKey = textureKey;

    this.arcadeSprite = this.scene.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, textureKey)
      .setCollideWorldBounds(true);

    // Resize player's bounding box and place it at bottom center of the sprite
    this.arcadeSprite.body
      .setSize(this.PLAYER_BBOX_WIDTH, this.PLAYER_BBOX_HEIGHT)
      .setOffset(
        (GameConstants.sprite.width - this.PLAYER_BBOX_WIDTH) / 2,
        GameConstants.sprite.height - this.PLAYER_BBOX_HEIGHT
      );

    this.registerAnimations();
  }

  update(time: number, delta: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Reset velocity from previous frame
    this.applyVelocityX(0);
    this.applyVelocityY(0);

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
      this.idle();
    }
  }

  addCollisionDetectionWith(gameObject: Phaser.GameObjects.GameObject) {
    this.scene.physics.add.collider(this.arcadeSprite, gameObject);
  }

  play(animationkey: string, ignoreIfPlaying?: boolean, startFrame?: number): Phaser.GameObjects.Sprite {
    // TODO: 2020-02-15 Blockost Play animation of all sprites in groups
    return this.arcadeSprite.play(animationkey, ignoreIfPlaying, startFrame);
  }

  private moveLeft() {
    this.applyVelocityX(this.PLAYER_VELOCITY_X * -1);
    this.play(this.ANIMATION_WALK_LEFT, true);
    this.facingDirection = FacingDirection.LEFT;
  }

  private moveRight() {
    this.applyVelocityX(this.PLAYER_VELOCITY_X);
    this.play(this.ANIMATION_WALK_RIGHT, true);
    this.facingDirection = FacingDirection.RIGHT;
  }

  private moveUp() {
    this.applyVelocityY(this.PLAYER_VELOCITY_Y * -1);
    this.play(this.ANIMATION_WALK_UP, true);
    this.facingDirection = FacingDirection.UP;
  }

  private moveDown() {
    this.applyVelocityY(this.PLAYER_VELOCITY_Y);
    this.play(this.ANIMATION_WALK_DOWN, true);
    this.facingDirection = FacingDirection.DOWN;
  }

  private applyVelocityX(velocity: number) {
    this.arcadeSprite.setVelocityX(velocity);
  }

  private applyVelocityY(velocity: number) {
    this.arcadeSprite.setVelocityY(velocity);
  }

  private idle() {
    switch (this.facingDirection) {
      case FacingDirection.LEFT:
        this.play(this.ANIMATION_IDLE_LEFT);
        break;

      case FacingDirection.RIGHT:
        this.play(this.ANIMATION_IDLE_RIGHT);
        break;

      case FacingDirection.UP:
        this.play(this.ANIMATION_IDLE_UP);
        break;

      case FacingDirection.DOWN:
        this.play(this.ANIMATION_IDLE_DOWN);
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
}
