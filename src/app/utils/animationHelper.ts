import GameConfig from './gameConfig';

/**
 * Animation configuration.
 */
export interface AnimationConfig {
  /**
   * Starts at index 0.
   */
  rowStart: number;
  /**
   * Number of sprites to skip at the beginning rowStart.
   */
  offsetStart: number;
  /**
   * Number of sprites the animation is composed of.
   */
  length: number;
}

/**
 * Helper class to work with Phaser animations from spritesheets.
 */
export default class AnimationHelper {
  /**
   * Retrieves start and end frame indexes needed to generate an Animation from a Spritesheet in Phaser 3.
   * @returns an array containing [startIndex, endIndex]
   */
  static getFrameIndexes(animationConfig: AnimationConfig): [number, number] {
    const frameStart =
      GameConfig.spritesheet.maxNumberOfSpritesPerRow * animationConfig.rowStart + animationConfig.offsetStart;
    const frameEnd = frameStart + animationConfig.length;

    return [frameStart, frameEnd];
  }
}
