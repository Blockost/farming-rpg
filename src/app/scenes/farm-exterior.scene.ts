import Player from '../objects/player';
import GameConfig from '../utils/gameConfig';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import TiledCollision from '../objects/tiled/tiledCollision';

export default class FarmExteriorScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmExteriorScene);
  }

  preload() {
    super.preload();

    this.load.spritesheet('player', '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    // Load map and associated tilesets
    this.load.tilemapTiledJSON('map_farm', '/assets/tilemaps/farm.json');
    this.load.image('tileset_terrain', '/assets/spritesheets/tiled/terrain.png');
    this.load.image('tileset_cottage', '/assets/spritesheets/tiled/cottage.png');
  }

  create() {
    super.create();

    // Create world from tilemap
    this.map = this.make.tilemap({ key: 'map_farm' });
    const terrainTileset = this.map.addTilesetImage('terrain', 'tileset_terrain');
    const cottageTileset = this.map.addTilesetImage('cottage', 'tileset_cottage');

    const belowPlayerL1 = this.map.createStaticLayer('below_player_L1', terrainTileset);
    const belowPlayerL2 = this.map.createStaticLayer('below_player_L2', terrainTileset);
    const playerLevelLayerL1 = this.map.createStaticLayer('player_level_L1', [terrainTileset, cottageTileset]);
    const playerLevelLayerL2 = this.map.createStaticLayer('player_level_L2', [terrainTileset, cottageTileset]);
    const abovePlayerLayer = this.map.createStaticLayer('above_player', cottageTileset);

    // Retrieve player spawn point
    const playerSpawnPoint = TilemapHelper.getSpawnPoint(this.map, 'player_start');

    // Retrieve collision objects from map and add them to world
    const tiledCollisions = TilemapHelper.buildCollisions(this, this.map);

    // Finally, creaTilemapHelperte player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);
    // Render 'above the player' layer higher than it
    abovePlayerLayer.setDepth(100);

    // Add collisions between player and world
    tiledCollisions.forEach((collision) =>
      this.physics.add.collider(this.player.getSprite(), collision, (obj1, obj2) => {
        (obj2 as TiledCollision).onCollide(this.player);
      })
    );

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(
        0,
        0,
        this.map.width * GameConfig.map.tileSize.width,
        this.map.height * GameConfig.map.tileSize.height
      );

    // If debug set to true, fill rectangle with debug color
    if (GameConfig.physics.showCollisionObjectsDebug) {
      this.showCollisionDebug(tiledCollisions);
    }
  }

  private showCollisionDebug(tiledCollisions: TiledCollision[]) {
    tiledCollisions.forEach((tiledCollision) => tiledCollision.showDebug());
  }
}
