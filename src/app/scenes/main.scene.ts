import Player from '../objects/player';
import GameConstants from '../utils/gameConstants';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';

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
    const tiledCollisionObjects = TilemapHelper.getCollisionObjects(farmMap);
    const collisiongroup = this.buildCollisions(tiledCollisionObjects);

    // Finally, create player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);
    // Render 'above the player' layer higher than it
    abovePlayerLayer.setDepth(100);

    // Add collisions between player and world
    this.physics.add.collider(this.player.getSprite(), collisiongroup);

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(0, 0, GameConstants.map.width, GameConstants.map.height);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }

  /**
   * Retrieves all collision objects defined in Tiled, adds them into a Arcade static group and returns it.
   * This group can then be used to render collision with player.
   *
   * This method ignores invisible ojects in Tiled.
   */
  private buildCollisions(collisionObjects: Phaser.Types.Tilemaps.TiledObject[]): Phaser.Physics.Arcade.StaticGroup {
    const collisiongroup = this.physics.add.staticGroup();

    collisionObjects
      // Filter out non visible objects
      .filter((obj) => obj.visible)
      // For each, create a rectangle and add it to the Arcade static group
      .forEach((obj) => {
        // XXX: 2020-03-01 Blockost Arcade physics only support collisions with rectangle shapes.
        // It is possible to render more complex shapes like polygons but its physics body will still
        // be a rectangle. If there's a need to enable collisions with more complex shapes, we'll need
        // to switch to Matter.js
        if (!obj.rectangle) {
          throw new Error(
            'Arcade physics only support collisions with rectangle shapes. ' +
              'Please, use rectangle objects to define collitions in Tiled.'
          );
        }

        const boundingBox = this.add.rectangle(obj.x, obj.y, obj.width, obj.height);

        // Update origin from (0.5, 0.5) to (0, 0) because that's how it works in Tiled
        boundingBox.setOrigin(0, 0);

        // If debug set to true, fill rectangle with debug color
        if (GameConstants.physics.debugCollidingTiles) {
          boundingBox.setFillStyle(0xf38630, 0.75);
        }

        collisiongroup.add(boundingBox);
      });

    return collisiongroup;
  }
}
