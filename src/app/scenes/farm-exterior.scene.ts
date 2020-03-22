import Player from '../objects/player';
import GameConfig from '../utils/gameConfig';
import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import Map from '../utils/map';

const MAP_KEY = 'map_farm';

export default class FarmExteriorScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmExteriorScene, MAP_KEY);
  }

  preload() {
    super.preload();

    this.load.spritesheet('body', '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    this.load.spritesheet('hair', '/assets/spritesheets/characters/hair/male/green.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    this.load.spritesheet('chest', '/assets/spritesheets/characters/chest/male/leather.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    this.load.spritesheet('pants', '/assets/spritesheets/characters/pants/male/white.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    this.load.spritesheet('shoes', '/assets/spritesheets/characters/shoes/male/black.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    // Load map and associated tilesets
    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm.json');
    this.load.image('terrain', '/assets/spritesheets/tiled/terrain.png');
    this.load.image('cottage', '/assets/spritesheets/tiled/cottage.png');
  }

  create() {
    super.create();

    this.player = new Player(this, { hair: 'hair', body: 'body', chest: 'chest', pants: 'pants', shoes: 'shoes' });

    this.map = new Map(this, this.player);

    // Retrieve player spawn point
    const playerSpawnPoint = this.map.getSpawnPoint('player_start');
    this.player.spawnAt(playerSpawnPoint);

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(
        0,
        0,
        this.map.getWidth() * GameConfig.map.tileSize.width,
        this.map.getHeight() * GameConfig.map.tileSize.height
      );
  }
}
