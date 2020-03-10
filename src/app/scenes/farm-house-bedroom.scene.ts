import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import Player from '../objects/player';
import TiledCollision from '../objects/tiled/tiledCollision';
import GameConfig from '../utils/gameConfig';

export default class FarmHouseBedroomScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmHouseBedroom);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON('map_farm_house_bedroom', '/assets/tilemaps/farm_house_bedroom.json');
    this.load.image('tileset_interior', '/assets/spritesheets/tiled/interior.png');
  }

  create() {
    super.create();

    // Create world from tilemap
    this.map = this.make.tilemap({ key: 'map_farm_house_bedroom' });
    const interiorTileset = this.map.addTilesetImage('interior', 'tileset_interior');
    this.map.createStaticLayer('below_player', interiorTileset);
    this.map.createStaticLayer('player_level_l1', interiorTileset);
    this.map.createStaticLayer('player_level_l2', interiorTileset);

    // Retrieve player spawn point
    const spawnPointName = this.transitionData.targetSpawnPointName;
    const playerSpawnPoint = TilemapHelper.getSpawnPoint(this.map, spawnPointName);

    // Retrieve collision objects from map and add them to world
    const tiledCollisions = TilemapHelper.buildCollisions(this, this.map);

    // Finally, create player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);

    // Add collisions between player and world
    tiledCollisions.forEach((collision) =>
      this.physics.add.collider(this.player.getSprite(), collision, (obj1, obj2) => {
        (obj2 as TiledCollision).onCollide(this.player);
      })
    );

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(0, 0, this.map.width * GameConfig.map.tileSize.width, this.map.height * GameConfig.map.tileSize.height)
      .setZoom(2);
  }
}
