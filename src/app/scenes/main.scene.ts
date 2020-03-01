import Player from '../objects/player';
import GameConstants from '../utils/gameConstants';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';
import TiledCollision from '../objects/tiled/tiledCollision';
import TiledTransition from '../objects/tiled/tiledTransition';

export default class MainScene extends BaseScene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(SceneKeys.MainScene);
  }

  preload() {
    super.preload();

    this.load.spritesheet('player', '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConstants.sprite.width,
      frameHeight: GameConstants.sprite.height
    });

    // Load map and associated tilesets
    this.load.tilemapTiledJSON('map_farm', '/assets/tilemaps/farm.json');
    this.load.image('tileset_terrain', '/assets/spritesheets/tiled/terrain.png');
    this.load.image('tileset_cottage', '/assets/spritesheets/tiled/cottage.png');
  }

  create() {
    super.create();

    // Add keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create world from tilemap
    const farmMap = this.make.tilemap({ key: 'map_farm' });
    const terrainTileset = farmMap.addTilesetImage('terrain', 'tileset_terrain');
    const cottageTileset = farmMap.addTilesetImage('cottage', 'tileset_cottage');

    const belowPlayerL1 = farmMap.createStaticLayer('below_player_L1', terrainTileset);
    const belowPlayerL2 = farmMap.createStaticLayer('below_player_L2', terrainTileset);
    const playerLevelLayerL1 = farmMap.createStaticLayer('player_level_L1', [terrainTileset, cottageTileset]);
    const playerLevelLayerL2 = farmMap.createStaticLayer('player_level_L2', [terrainTileset, cottageTileset]);
    const abovePlayerLayer = farmMap.createStaticLayer('above_player', cottageTileset);

    // Retrieve player spawn point
    const playerSpawnPoint = TilemapHelper.getSpawnPoint(farmMap, 'Player');

    // Retrieve collision objects from map and add them to world
    const tiledCollisionLayer = TilemapHelper.getCollisionLayer(farmMap);
    const tiledCollisions = this.buildCollisions(tiledCollisionLayer);

    // Finally, create player. Must be created last since it needs to be rendered above the world
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
      .setBounds(0, 0, GameConstants.map.width, GameConstants.map.height);

    // If debug set to true, fill rectangle with debug color
    if (GameConstants.physics.showCollisionObjectsDebug) {
      this.showCollisionDebug(tiledCollisions);
    }
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }

  /**
   * Retrieves all collision objects defined in Tiled and creates a TiledCollision or TiledTransition
   * object. This object can then be used to create collisions with player or transition between
   * scenes.
   *
   * This method ignores invisible objects in Tiled.
   */
  private buildCollisions(collisionObjects: Phaser.Types.Tilemaps.TiledObject[]): TiledCollision[] {
    // Filter out non visible objects
    return collisionObjects
      .filter((obj) => obj.visible)
      .map((obj) => {
        if (obj.properties && obj.properties.transitionTo) {
          return new TiledTransition(this, obj);
        }

        return new TiledCollision(this, obj);
      });
  }

  private showCollisionDebug(tiledCollisions: TiledCollision[]) {
    tiledCollisions.forEach((tiledCollision) => tiledCollision.showDebug());
  }
}
