const GameConstants = {
  /**
   * Size of the canvas in the HTML page
   */
  width: 800,
  height: 640,
  /**
   * Size of the maps (levels)
   */
  map: {
    width: 1600,
    height: 1280
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
    debugCollidingTiles: true
  }
};

export default GameConstants;
