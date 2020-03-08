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
    tileSize: {
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
    showEngineDebug: true,
    showCollisionObjectsDebug: true
  }
};

export default GameConfig;
