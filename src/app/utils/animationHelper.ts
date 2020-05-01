import GameConfig from './gameConfig';

export const ANIMATION_KEYS = {
  WALK_LEFT: 'WALK_LEFT',
  IDLE_LEFT: 'IDLE_LEFT',
  WALK_RIGHT: 'WALK_RIGHT',
  IDLE_RIGHT: 'IDLE_RIGHT',
  WALK_UP: 'WALK_UP',
  IDLE_UP: 'IDLE_UP',
  WALK_DOWN: 'WALK_DOWN',
  IDLE_DOWN: 'IDLE_DOWN'
};

/**
 * Helper class to work with Phaser animations from spritesheets.
 *
 * Note: Animations are global in Phaser and does not need to be re-registered for each scene,
 * unless sprites have changed.
 */
export default class AnimationHelper {
  static registerAnimations(scene: Phaser.Scene, textureKeys: string[]) {
    // LEFT
    let [startIndex, endIndex] = AnimationHelper.getFrameIndexes(9, 7, 1);
    AnimationHelper.build(scene, textureKeys, startIndex, endIndex, 'LEFT');

    // RIGHT
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes(11, 7, 1);
    AnimationHelper.build(scene, textureKeys, startIndex, endIndex, 'RIGHT');

    // UP
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes(8, 7, 1);
    AnimationHelper.build(scene, textureKeys, startIndex, endIndex, 'UP');

    // DOWN
    [startIndex, endIndex] = AnimationHelper.getFrameIndexes(10, 7, 1);
    AnimationHelper.build(scene, textureKeys, startIndex, endIndex, 'DOWN');
  }

  /**
   * Retrieves start and end frame indexes needed to generate an Animation from a Spritesheet in Phaser 3.
   *
   * @param rowStart Starts at index 0.
   * @param length Number of sprites the animation is composed of
   * @param offsetStart Number of sprites to skip at the beginning rowStart
   * @returns an array containing [startIndex, endIndex]
   */
  static getFrameIndexes(rowStart: number, length: number, offsetStart: number): [number, number] {
    const frameStart = GameConfig.spritesheet.maxNumberOfSpritesPerRow * rowStart + offsetStart;
    const frameEnd = frameStart + length;

    return [frameStart, frameEnd];
  }

  /**
   * Builds 'WALK" and 'IDLE' animations for each textures.
   */
  static build(scene: Phaser.Scene, textureKeys: string[], startIndex: number, endIndex: number, direction: string) {
    textureKeys.forEach((textureKey) => {
      const frames = scene.anims.generateFrameNumbers(textureKey, {
        start: startIndex,
        end: endIndex
      });

      // Walk
      scene.anims.create({
        key: AnimationHelper.buildAnimationKey(textureKey, `WALK_${direction}`),
        frames: frames,
        repeat: -1,
        frameRate: 10
      });

      // Idle
      scene.anims.create({
        key: AnimationHelper.buildAnimationKey(textureKey, `IDLE_${direction}`),
        frames: [{ key: textureKey, frame: startIndex - 1 }],
        frameRate: 10
      });
    });
  }

  static buildAnimationKey(textureKey: string, name: string) {
    return `${textureKey}_${name};`;
  }
}
