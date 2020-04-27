import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import Player from '../objects/player';
import { SkinPalette, HairPalette, HairStyle } from '../utils/colorPaletteUtil';
import GameConfig from '../utils/gameConfig';
import Map from '../utils/map';

const MAP_KEY = 'map_farm_house_bedroom';

export default class FarmHouseBedroomScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmHouseBedroom, MAP_KEY);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm_house_bedroom.json');
    this.load.image('interior', '/assets/spritesheets/tiled/interior.png');
  }

  create() {
    super.create();

    // TODO: How does this work since texture for player has not been loaded in preload() method??
    this.player = new Player(this, {
      hair: {
        style: HairStyle.Bangs,
        color: HairPalette.Blonde
      },
      body: SkinPalette.Light,
      chest: 'chest',
      pants: 'pants',
      shoes: 'shoes'
    });

    // Create world from tilemap
    this.map = new Map(this, this.player);

    // Retrieve player spawn point
    const spawnPointName = this.transitionData.targetSpawnPointName;
    const playerSpawnPoint = this.map.getSpawnPoint(spawnPointName);
    this.player.spawnAt(playerSpawnPoint);

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
