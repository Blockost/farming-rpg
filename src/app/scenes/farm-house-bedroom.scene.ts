import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import Player from '../objects/player';
import GameConfig from '../utils/gameConfig';
import Map from '../utils/map';

export default class FarmHouseBedroomScene extends BaseScene {
  public readonly mapKey = 'map_farm_house_floor';

  constructor() {
    super(SceneKey.FarmHouseBedroom);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm_house_bedroom.json');
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
    // TODO: How does this work since texture for player has not been loaded in preload() method??
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
      .setZoom(2);
  }
}
