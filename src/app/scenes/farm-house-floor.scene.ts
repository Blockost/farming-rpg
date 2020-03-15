import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import GameConfig from '../utils/gameConfig';
import Player from '../objects/player';
import Map from '../utils/map';

export default class FarmHouseFloorScene extends BaseScene {
  public readonly mapKey = 'map_farm_house_floor';

  constructor() {
    super(SceneKey.FarmHouseFloorScene);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm_house_floor.json');
    this.load.image('interior', '/assets/spritesheets/tiled/interior.png');
  }

  create() {
    super.create();

    // Create world from tilemap
    this.map = new Map(this);

    // Retrieve player spawn point
    const spawnPointName = this.transitionData.targetSpawnPointName;
    const playerSpawnPoint = this.map.getSpawnPoint(spawnPointName);

    // Finally, create player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);

    // Add collisions
    this.map.enablesCollisionWithPlayer(this.player);

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(
        0,
        0,
        this.map.getWidth() * GameConfig.map.tileSize.width,
        this.map.getHeight() * GameConfig.map.tileSize.height
      )
      .setZoom(1.5);
  }
}
