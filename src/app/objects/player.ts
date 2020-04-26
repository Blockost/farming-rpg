import * as Phaser from 'phaser';
import AnimationHelper, { ANIMATION_KEYS } from '../utils/animationHelper';
import FacingDirection from '../utils/facingDirection';
import GameConfig from '../utils/gameConfig';
import TiledSpawnPoint from './tiled/tiledSpawnPoint';
import { SkinPalette } from '../utils/colorPaletteUtil';

const PLAYER_VELOCITY_X = 140;
const PLAYER_VELOCITY_Y = 140;

const PLAYER_BBOX_WIDTH = 20;
const PLAYER_BBOX_HEIGHT = 10;

interface PhysicalCharacteristicsConfig {
  hair: string;
  body: SkinPalette;
  chest: string;
  pants: string;
  shoes: string;
}

export default class Player {
  private scene: Phaser.Scene;
  private facingDirection: FacingDirection = FacingDirection.DOWN;
  private physicsGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, physicalCharacteristicsConfig: PhysicalCharacteristicsConfig) {
    this.scene = scene;

    // Body is created first so that other sprites are automatically rendered on top of it
    // We give it a name in order to filter out other sprites during collision check
    const bodySprite = this.scene.physics.add.sprite(200, 200, `body-${physicalCharacteristicsConfig.body}`);
    bodySprite.name = 'body';
    const hairSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristicsConfig.hair);
    const chestSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristicsConfig.chest);
    const pantsSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristicsConfig.pants);
    const shoesSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristicsConfig.shoes);

    // Add all sprites to a group for easy management
    this.physicsGroup = this.scene.physics.add.group([hairSprite, bodySprite, chestSprite, pantsSprite, shoesSprite]);

    // Resize all the bounding boxes and place them at bottom center of the sprite
    this.physicsGroup.getChildren().forEach((sprite: Phaser.Physics.Arcade.Sprite) => {
      sprite.body
        .setSize(PLAYER_BBOX_WIDTH, PLAYER_BBOX_HEIGHT)
        .setOffset((GameConfig.sprite.width - PLAYER_BBOX_WIDTH) / 2, GameConfig.sprite.height - PLAYER_BBOX_HEIGHT);
    });

    // Register all animations
    AnimationHelper.registerAnimations(this.scene, [
      physicalCharacteristicsConfig.hair,
      `body-${physicalCharacteristicsConfig.body}`,
      physicalCharacteristicsConfig.chest,
      physicalCharacteristicsConfig.pants,
      physicalCharacteristicsConfig.shoes
    ]);
  }

  /**
   * Returns the first active sprite from player's sprite group.
   */
  getSprite(): Phaser.Physics.Arcade.Sprite {
    // XXX: 2020-03-22 Blockost This is needed for the camera since it can't follow
    // the entire group (apparently...)
    return this.physicsGroup.getFirst(true);
  }

  /**
   * Returns the whole group of sprites that commposes the player.
   */
  getGroup(): Phaser.Physics.Arcade.Group {
    return this.physicsGroup;
  }

  getFacingDirection(): FacingDirection {
    return this.facingDirection;
  }

  spawnAt(spawnPoint: TiledSpawnPoint) {
    this.physicsGroup.setXY(spawnPoint.x, spawnPoint.y);
    this.facingDirection = spawnPoint.facingDirection;
  }

  setDepth(depth: number) {
    this.physicsGroup.setDepth(depth);
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

  private moveLeft() {
    this.applyVelocityX(PLAYER_VELOCITY_X * -1);
    this.play(ANIMATION_KEYS.WALK_LEFT, true);
    this.facingDirection = FacingDirection.LEFT;
  }

  private moveRight() {
    this.applyVelocityX(PLAYER_VELOCITY_X);
    this.play(ANIMATION_KEYS.WALK_RIGHT, true);
    this.facingDirection = FacingDirection.RIGHT;
  }

  private moveUp() {
    this.applyVelocityY(PLAYER_VELOCITY_Y * -1);
    this.play(ANIMATION_KEYS.WALK_UP, true);
    this.facingDirection = FacingDirection.UP;
  }

  private moveDown() {
    this.applyVelocityY(PLAYER_VELOCITY_Y);
    this.play(ANIMATION_KEYS.WALK_DOWN, true);
    this.facingDirection = FacingDirection.DOWN;
  }

  private applyVelocityX(velocity: number) {
    this.physicsGroup.setVelocityX(velocity);
  }

  private applyVelocityY(velocity: number) {
    this.physicsGroup.setVelocityY(velocity);
  }

  private idle() {
    switch (this.facingDirection) {
      case FacingDirection.LEFT:
        this.play(ANIMATION_KEYS.IDLE_LEFT);
        break;

      case FacingDirection.RIGHT:
        this.play(ANIMATION_KEYS.IDLE_RIGHT);
        break;

      case FacingDirection.UP:
        this.play(ANIMATION_KEYS.IDLE_UP);
        break;

      case FacingDirection.DOWN:
        this.play(ANIMATION_KEYS.IDLE_DOWN);
        break;

      default:
        throw new Error(`Unsupported facing direction ${this.facingDirection}`);
    }
  }

  /**
   * Plays the given animation for all the sprites.
   */
  private play(animationName: string, ignoreIfPlaying?: boolean, startFrame?: number) {
    this.physicsGroup.getChildren().forEach((sprite: Phaser.Physics.Arcade.Sprite) => {
      sprite.play(AnimationHelper.buildAnimationKey(sprite.texture.key, animationName), ignoreIfPlaying, startFrame);
    });
  }
}
