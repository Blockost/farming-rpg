import Player, { PlayerData } from '../objects/player';
import ColorPaletteUtil, {
  SkinPalette,
  HairPalette,
  HairStyle,
  Gender,
  extractNamesFromEnum
} from '../utils/colorPaletteUtil';
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

    // TODO: Support different gender
    // Loading skin styles
    this.load.spritesheet(Gender.Male, '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConfig.sprite.width,
      frameHeight: GameConfig.sprite.height
    });

    // Loading hair styles
    // TODO: Think about deleting those textures if not needed (player + npc may not use every hair style possible)
    extractNamesFromEnum(HairStyle).forEach((name) =>
      this.load.spritesheet(name, `/assets/spritesheets/characters/hair/male/${name}.png`, {
        frameWidth: GameConfig.sprite.width,
        frameHeight: GameConfig.sprite.height
      })
    );

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
    ColorPaletteUtil.createHairTextures(this, HAIR_PALETTE_KEY, HairStyle.Xlongknot);
    ColorPaletteUtil.createSkinTextures(this, SKIN_PALETTE_KEY, Gender.Male);

    // TODO: This should be created by another scene that handles player customization
    // at the start of the game
    const playerData: PlayerData = {
      physicalCharacteristicsConfig: {
        hair: {
          style: HairStyle.Xlongknot,
          color: HairPalette.Green
        },
        body: {
          gender: Gender.Male,
          skin: SkinPalette.Light
        },
        chest: 'chest',
        pants: 'pants',
        shoes: 'shoes'
      }
    };

    this.player = new Player(this, playerData, true);
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
