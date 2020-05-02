import Player, { PlayerData } from '../objects/characters/player';
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
import FacingDirection from '../utils/facingDirection';
import NonPlayableCharacter, { NonPlayableCharacterData } from '../objects/characters/npc';

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

    this.load.image('character_shadow', '/assets/sprites/misc/character_shadow.png');
  }

  create() {
    super.create();

    // TODO: 2020-04-26 Blockost Move this outside of the scene. Many of the sprites/textures can be loaded
    // in a "loading" scene since TextureManager is shared between all scenes anyway.
    // The scene can display progression as a progress bar with funny quotes like 'building world', 'adding people",
    // 'growing vegetables', ...
    ColorPaletteUtil.createHairTextures(this, HAIR_PALETTE_KEY, HairStyle.Xlongknot);
    ColorPaletteUtil.createHairTextures(this, HAIR_PALETTE_KEY, HairStyle.Bangs);
    ColorPaletteUtil.createHairTextures(this, HAIR_PALETTE_KEY, HairStyle.Mohawk);
    ColorPaletteUtil.createHairTextures(this, HAIR_PALETTE_KEY, HairStyle.Messy1);
    ColorPaletteUtil.createSkinTextures(this, SKIN_PALETTE_KEY, Gender.Male);

    // TODO: This should be created by another scene that handles player customization
    // at the start of the game
    const playerData: PlayerData = {
      abstractCharacterData: {
        name: 'Blockost',
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

    // Add other characters to the scene
    const tristamCharacterData: NonPlayableCharacterData = {
      abstractCharacterData: {
        name: 'Tristam',
        physicalCharacteristicsConfig: {
          hair: {
            style: HairStyle.Bangs,
            color: HairPalette.Black
          },
          body: {
            gender: Gender.Male,
            skin: SkinPalette.Dark2
          },
          chest: 'chest',
          pants: 'pants',
          shoes: 'shoes'
        }
      }
    };
    const tristam = new NonPlayableCharacter(this, tristamCharacterData, true);
    tristam.spawnAt({
      x: playerSpawnPoint.x + Math.random() * 200,
      y: playerSpawnPoint.y - Math.random() * 200,
      facingDirection: FacingDirection.LEFT
    });

    const kevinCharacterData: NonPlayableCharacterData = {
      abstractCharacterData: {
        name: 'Kevin',
        physicalCharacteristicsConfig: {
          hair: {
            style: HairStyle.Mohawk,
            color: HairPalette.Redhead
          },
          body: {
            gender: Gender.Male,
            skin: SkinPalette.DarkElf
          },
          chest: 'chest',
          pants: 'pants',
          shoes: 'shoes'
        }
      }
    };
    const kevin = new NonPlayableCharacter(this, kevinCharacterData, true);
    kevin.spawnAt({
      x: playerSpawnPoint.x + Math.random() * 200,
      y: playerSpawnPoint.y + Math.random() * 200,
      facingDirection: FacingDirection.RIGHT
    });

    const aliciaCharacterData: NonPlayableCharacterData = {
      abstractCharacterData: {
        name: 'Alicia',
        physicalCharacteristicsConfig: {
          hair: {
            style: HairStyle.Messy1,
            color: HairPalette.WhiteCyan
          },
          body: {
            gender: Gender.Male,
            // TODO: Should be a female here
            skin: SkinPalette.Tanned
          },
          chest: 'chest',
          pants: 'pants',
          shoes: 'shoes'
        }
      }
    };
    const alicia = new NonPlayableCharacter(this, aliciaCharacterData, true);
    alicia.spawnAt({
      x: playerSpawnPoint.x - Math.random() * 200,
      y: playerSpawnPoint.y + Math.random() * 200,
      facingDirection: FacingDirection.DOWN
    });

    this.addToUpdateLoop([tristam, kevin, alicia]);
  }
}
