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

    this.load.spritesheet('player', '/assets/spritesheets/characters/body/male/light.png', {
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

    this.player = new Player(this, 'player');

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
