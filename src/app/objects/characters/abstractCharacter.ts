import * as Phaser from 'phaser';
import AnimationHelper, { ANIMATION_KEYS } from '../../utils/animationHelper';
import FacingDirection from '../../utils/facingDirection';
import GameConfig from '../../utils/gameConfig';
import TiledSpawnPoint from '../tiled/tiledSpawnPoint';
import { SkinPalette, HairPalette, HairStyle, Gender } from '../../utils/colorPaletteUtil';
import BaseScene from 'src/app/scenes/base.scene';

const DEFAULT_VELOCITY_X = 140;
const DEFAULT_VELOCITY_Y = 140;

const BBOX_WIDTH = 20;
const BBOX_HEIGHT = 10;

export interface AbstractCharacterData {
  name: string;
  physicalCharacteristicsConfig: PhysicalCharacteristics;
}

// TODO: In a not too distant future, we would probably want to split this config into
// Equipment (gears) and other body characteristics
interface PhysicalCharacteristics {
  hair: HairCharacteristics;
  body: BodyCharacteristics;
  chest: string;
  pants: string;
  shoes: string;
}

interface HairCharacteristics {
  style: HairStyle;
  color: HairPalette;
}

interface BodyCharacteristics {
  gender: Gender;
  skin: SkinPalette;
}

export default abstract class AbstractCharacter {
  private scene: Phaser.Scene;
  private facingDirection: FacingDirection = FacingDirection.DOWN;
  private physicsGroup: Phaser.Physics.Arcade.Group;

  // Movement variables
  private goLeft = false;
  private goRight = false;
  private goUp = false;
  private goDown = false;

  constructor(scene: BaseScene, data: AbstractCharacterData, registerAnimations = false) {
    this.scene = scene;
    const physicalCharacteristics = data.physicalCharacteristicsConfig;

    // Shadow is created first so that other sprites are automatically rendered on top of it
    const shadowSprite = this.scene.physics.add.sprite(200, 200, 'character_shadow');
    shadowSprite.name = 'shadow';

    // Give a name to body order to filter out other sprites during collision check
    const bodyTexture = `${physicalCharacteristics.body.gender}-${physicalCharacteristics.body.skin}`;
    const bodySprite = this.scene.physics.add.sprite(200, 200, bodyTexture);
    bodySprite.name = 'body';

    const hairTexture = `${physicalCharacteristics.hair.style}-${physicalCharacteristics.hair.color}`;
    const hairSprite = this.scene.physics.add.sprite(200, 200, hairTexture);

    const chestSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristics.chest);
    const pantsSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristics.pants);
    const shoesSprite = this.scene.physics.add.sprite(200, 200, physicalCharacteristics.shoes);

    // Add all sprites to a group for easy management
    this.physicsGroup = this.scene.physics.add.group([
      hairSprite,
      bodySprite,
      chestSprite,
      pantsSprite,
      shoesSprite,
      shadowSprite
    ]);

    // Resize all the bounding boxes and place them at bottom center of the sprite
    this.physicsGroup.getChildren().forEach((sprite: Phaser.Physics.Arcade.Sprite) => {
      sprite.body
        .setSize(BBOX_WIDTH, BBOX_HEIGHT)
        .setOffset((sprite.width - BBOX_WIDTH) / 2, sprite.height - BBOX_HEIGHT);
    });

    // Register all animations if necessary (animations are global)
    if (registerAnimations) {
      AnimationHelper.registerAnimations(this.scene, [
        hairTexture,
        bodyTexture,
        physicalCharacteristics.chest,
        physicalCharacteristics.pants,
        physicalCharacteristics.shoes
      ]);
    }
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

  setMovement(goLeft: boolean, goRight: boolean, goUp: boolean, goDown: boolean, duration?: number) {
    this.goLeft = goLeft;
    this.goRight = goRight;
    this.goDown = goDown;
    this.goUp = goUp;

    if (duration) {
      setTimeout(() => this.setMovement(false, false, false, false), duration);
    }
  }

  /**
   * Spaws this character at a specific location (x,y) facing a specific direction.
   */
  spawnAt(spawnPoint: TiledSpawnPoint) {
    this.physicsGroup.setXY(spawnPoint.x, spawnPoint.y);

    // Make sure shadow is at the character's feet
    const shadowSprite = this.physicsGroup
      .getChildren()
      .find((sprite) => sprite.name === 'shadow') as Phaser.Physics.Arcade.Sprite;
    shadowSprite.setPosition(spawnPoint.x, spawnPoint.y + GameConfig.sprite.height / 2 - shadowSprite.height / 2);

    this.facingDirection = spawnPoint.facingDirection;
  }

  setDepth(depth: number) {
    this.physicsGroup.setDepth(depth);
  }

  /**
   * Character's update loop.
   */
  update(time: number, delta: number) {
    // Reset velocity from previous frame
    this.applyVelocityX(0);
    this.applyVelocityY(0);

    if (this.goLeft) {
      this.moveLeft();
    } else if (this.goRight) {
      this.moveRight();
    } else if (this.goDown) {
      this.moveDown();
    } else if (this.goUp) {
      this.moveUp();
    } else {
      // No movement, go idle
      this.idle();
    }
  }

  private moveLeft() {
    this.applyVelocityX(DEFAULT_VELOCITY_X * -1);
    this.play(ANIMATION_KEYS.WALK_LEFT, true);
    this.facingDirection = FacingDirection.LEFT;
  }

  private moveRight() {
    this.applyVelocityX(DEFAULT_VELOCITY_X);
    this.play(ANIMATION_KEYS.WALK_RIGHT, true);
    this.facingDirection = FacingDirection.RIGHT;
  }

  private moveUp() {
    this.applyVelocityY(DEFAULT_VELOCITY_Y * -1);
    this.play(ANIMATION_KEYS.WALK_UP, true);
    this.facingDirection = FacingDirection.UP;
  }

  private moveDown() {
    this.applyVelocityY(DEFAULT_VELOCITY_Y);
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
    this.physicsGroup
      .getChildren()
      .filter((sprite) => sprite.name !== 'shadow')
      .forEach((sprite: Phaser.Physics.Arcade.Sprite) => {
        sprite.play(AnimationHelper.buildAnimationKey(sprite.texture.key, animationName), ignoreIfPlaying, startFrame);
      });
  }
}
