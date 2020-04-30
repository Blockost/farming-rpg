import Player from '../objects/player';
import ColorPaletteUtil, { SkinPalette, HairPalette, HairStyle } from '../utils/colorPaletteUtil';
import GameConfig from '../utils/gameConfig';
import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import Map from '../utils/map';

const MAP_KEY = 'map_farm';

const SKIN_PALETTE_KEY = 'skin_palette';
const HAIR_PALETTE_KEY = 'hair_palette';

export default class FarmExteriorScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmExteriorScene, MAP_KEY);
  }

  preload() {
    super.preload();

    // Load body styles
    this.load.spritesheet('body', '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    // Loading hairstyles
    this.load.spritesheet('bangs', '/assets/spritesheets/characters/hair/male/bangs.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });
    this.load.spritesheet('mohawk', '/assets/spritesheets/characters/hair/male/mohawk.png', {
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

    // Skin palette
    this.load.image(SKIN_PALETTE_KEY, '/assets/spritesheets/characters/palettes/skin_palette.png');
    // Hair palette
    this.load.image(HAIR_PALETTE_KEY, '/assets/spritesheets/characters/palettes/hair_palette.png');
  }

  create() {
    super.create();

    // TODO: 2020-04-26 Blockost Move this outside of the scene. Many of the sprites/textures can be loaded
    // in a "loading" scene since TextureManager is shared between all scenes anyway.
    // The scene can display progression as a progress bar with funny quotes like 'building world', 'adding people",
    // 'growing vegetables', ...
    ColorPaletteUtil.createHairPalettes(this, HAIR_PALETTE_KEY, 'bangs');
    ColorPaletteUtil.createSkinPalettes(this, SKIN_PALETTE_KEY, 'body');

    this.player = new Player(this, {
      hair: {
        style: HairStyle.Bangs,
        color: HairPalette.Green
      },
      body: SkinPalette.Light,
      chest: 'chest',
      pants: 'pants',
      shoes: 'shoes'
    });

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
