/**
 * Game configuration.
 */
const GameConfig = {
  /**
   * Size of the canvas in the HTML page
   */
  width: 800,
  height: 640,
  /**
   * Size of the maps (levels)
   */
  map: {
    width: 40, // In number of tiles
    height: 30, // In number of tiles
    tile: {
      width: 32,
      height: 32
    }
  },
  sprite: {
    width: 64,
    height: 64
  },
  spritesheet: {
    maxNumberOfSpritesPerRow: 13
  },
  physics: {
    gravity: 0,
    showEngineDebug: false,
    showCollisionObjectsDebug: true
  }
};

export default GameConfig;
