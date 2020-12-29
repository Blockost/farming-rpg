import { Gender, HairStyle, HAIR_PALETTE_KEY, SKIN_PALETTE_KEY } from '../utils/colorPaletteUtil';
import EnumHelper from '../utils/enumHelper';
import GameConfig from '../utils/gameConfig';
import SceneKey from './sceneKey';

/**
 * Boot scene is loading all sprites, sounds and game assets from disk.
 *
 * Another loading phase is required to initialize spritesheets with different color palettes,
 * build animations, and other "heavy" operations.
 *
 * @see PreloaderScene
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super(SceneKey.BootScene);
  }

  preload() {
    // TODO: Support different gender
    // Loading skin styles
    this.load.spritesheet(Gender.Male, '/assets/spritesheets/characters/body/male/light.png', {
      frameWidth: GameConfig.sprite.character.width,
      frameHeight: GameConfig.sprite.character.height
    });

    // Loading hair styles
    // TODO: Think about deleting those textures if not needed (player + npc may not use every hair style possible)
    EnumHelper.extractNamesFromEnum(HairStyle)
      // We use lowercased name here because that's how the assets are named
      .map((name) => name.toLowerCase())
      .forEach((name) =>
        this.load.spritesheet(name, `/assets/spritesheets/characters/hair/male/${name}.png`, {
          frameWidth: GameConfig.sprite.character.width,
          frameHeight: GameConfig.sprite.character.height
        })
      );

    this.load.spritesheet('chest', '/assets/spritesheets/characters/chest/male/leather.png', {
      frameWidth: GameConfig.sprite.character.width,
      frameHeight: GameConfig.sprite.character.height
    });

    this.load.spritesheet('pants', '/assets/spritesheets/characters/pants/male/white.png', {
      frameWidth: GameConfig.sprite.character.width,
      frameHeight: GameConfig.sprite.character.height
    });

    this.load.spritesheet('shoes', '/assets/spritesheets/characters/shoes/male/black.png', {
      frameWidth: GameConfig.sprite.character.width,
      frameHeight: GameConfig.sprite.character.height
    });

    // Crops
    this.load.spritesheet('crops', '/assets/spritesheets/crops/crops.png', {
      frameWidth: GameConfig.sprite.crop.width,
      frameHeight: GameConfig.sprite.crop.height
    });
    this.load.spritesheet('crops_picked', '/assets/spritesheets/crops/crops_picked.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('crops_sparkles', '/assets/spritesheets/crops/crops_sparkles.png', {
      frameWidth: 16,
      frameHeight: 16
    });

    // Skin palette
    this.load.image(SKIN_PALETTE_KEY, '/assets/spritesheets/characters/palettes/skin_palette.png');
    // Hair palette
    this.load.image(HAIR_PALETTE_KEY, '/assets/spritesheets/characters/palettes/hair_palette.png');

    this.load.image('character_shadow', '/assets/sprites/misc/character_shadow.png');
  }

  create() {
    this.scene.start(SceneKey.PreloaderScene);
  }
}
