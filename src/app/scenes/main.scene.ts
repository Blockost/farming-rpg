import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';
import Player from '../objects/player';
import GameConstants from '../utils/gameConstants';
import TilemapHelper from '../utils/tiled/tilemapHelper';

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

    this.load.spritesheet('hair_male_green', '/assets/spritesheets/characters/hair/male/green.png', {
      frameWidth: GameConstants.sprite.width,
      frameHeight: GameConstants.sprite.height
    });

    this.load.image('tiles', '/assets/tilesets/tuxmon-sample-32px.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/tilemaps/test.json');
  }

  create() {
    super.create();

    // Add keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create world from tilemap
    const tilemap = this.make.tilemap({ key: 'tilemap' });
    const tileset = tilemap.addTilesetImage('tuxmon-sample-32px', 'tiles');
    const belowPlayer = tilemap.createStaticLayer('Below player', tileset);
    const playerLevelLayer = tilemap.createStaticLayer('Player level', tileset);
    const abovePlayerLayer = tilemap.createStaticLayer('Above Player', tileset);

    // Enable collision on tiles having with the 'collides' property
    playerLevelLayer.setCollisionByProperty({ collides: true });

    if (GameConstants.physics.debugCollidingTiles) {
      const debugGraphics = this.add.graphics().setAlpha(0.75);
      playerLevelLayer.renderDebug(debugGraphics, {
        tileColor: null, // No color for non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
      });
    }

    // Retrieve player spawn point
    const playerSpawnPoint = TilemapHelper.getSpawnPoint(tilemap, 'Player');

    // Finally, create player. Must be created last since it needs to be rendered above the world
    this.player = new Player(this, 'player', playerSpawnPoint);
    // Render 'above the player' layer higher than it
    abovePlayerLayer.setDepth(100);

    // Add collision between player and world
    this.player.addCollisionDetectionWith(playerLevelLayer);
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }
}
