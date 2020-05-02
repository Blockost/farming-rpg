/**
 * Game configuration.
 */
const GameConfig = {
  // Size of the canvas in the HTML page (in pixels)
  width: 1280,
  height: 720,
  map: {
    // Size of the tiles used to build maps (in pixels)
    tileSize: {
      width: 32,
      height: 32
    }
  },
  sprite: {
    character: {
      width: 64,
      height: 64
    },
    crop: {
      width: 32,
      height: 64
    }
  },
  spritesheet: {
    maxNumberOfSpritesPerRow: 13
  },
  physics: {
    gravity: 0,
    showEngineDebug: false,
    showCollisionObjectsDebug: false
  }
};

export default GameConfig;
