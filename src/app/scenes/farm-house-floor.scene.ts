import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import GameConfig from '../utils/gameConfig';
import Player from '../objects/player';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import TiledCollision from '../objects/tiled/tiledCollision';

export default class FarmHouseFloorScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmHouseFloorScene);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON('map_farm_house_floor', '/assets/tilemaps/farm_house_floor.json');
    this.load.image('tileset_interior', '/assets/spritesheets/tiled/interior.png');
  }

  create() {
    super.create();

    // Create world from tilemap
    this.map = this.make.tilemap({ key: 'map_farm_house_floor' });
    const interiorTileset = this.map.addTilesetImage('interior', 'tileset_interior');
    this.map.createStaticLayer('player_level_l1', interiorTileset);
    this.map.createStaticLayer('player_level_l2', interiorTileset);
    this.map.createStaticLayer('player_level_l3', interiorTileset);

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
      .setZoom(1.5);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }
}
