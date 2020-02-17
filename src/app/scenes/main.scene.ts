import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';
import Player from '../objects/player';
import GameConstants from '../utils/gameConstants';
import TilemapHelper from '../utils/tiled/tilemapHelper';

export default class MainScene extends BaseScene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  debugGraphics: Phaser.GameObjects.Graphics;
  mainCamera: Phaser.Cameras.Scene2D.Camera;

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

    // Enable collision on tiles having with the 'collides' property
    belowPlayerL1.setCollisionByProperty({ collides: true });
    belowPlayerL2.setCollisionByProperty({ collides: true });
    playerLevelLayerL1.setCollisionByProperty({ collides: true });
    playerLevelLayerL2.setCollisionByProperty({ collides: true });

    // Add graphics debug
    this.debugGraphics = this.add.graphics().setAlpha(0.75);
    this.renderDebugGraphicsFor([belowPlayerL1, belowPlayerL2, playerLevelLayerL1, playerLevelLayerL2]);

    // Retrieve player spawn point
    const playerSpawnPoint = TilemapHelper.getSpawnPoint(farmMap, 'Player');

    // Finally, create player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);
    // Render 'above the player' layer higher than it
    abovePlayerLayer.setDepth(100);

    // Add collision between player and world
    this.physics.add.collider(this.player.getSprite(), belowPlayerL1);
    this.physics.add.collider(this.player.getSprite(), belowPlayerL2);
    this.physics.add.collider(this.player.getSprite(), playerLevelLayerL1);
    this.physics.add.collider(this.player.getSprite(), playerLevelLayerL2);

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(0, 0, GameConstants.map.width, GameConstants.map.height);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }

  private renderDebugGraphicsFor(layers: Phaser.Tilemaps.StaticTilemapLayer[]) {
    if (GameConstants.physics.debugCollidingTiles) {
      layers.forEach((layer) =>
        layer.renderDebug(this.debugGraphics, {
          tileColor: null, // No color for non-colliding tiles
          collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
          faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        })
      );
    }
  }
}
