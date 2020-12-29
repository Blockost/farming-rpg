import NonPlayableCharacter, { NonPlayableCharacterData } from '../objects/characters/npc';
import Player, { PlayerData } from '../objects/characters/player';
import Crop, { CropType } from '../objects/crops/crop';
import { Gender, HairPalette, HairStyle, SkinPalette } from '../utils/colorPaletteUtil';
import FacingDirection from '../utils/facingDirection';
import GameConfig from '../utils/gameConfig';
import Map from '../utils/map';
import BaseScene from './base.scene';
import SceneKey from './sceneKey';

const MAP_KEY = 'map_farm';

export default class FarmExteriorScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmExteriorScene, MAP_KEY);
  }

  preload() {
    super.preload();

    // Load map and associated tilesets
    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm.json');
    this.load.image('terrain', '/assets/spritesheets/tiled/terrain.png');
    this.load.image('cottage', '/assets/spritesheets/tiled/cottage.png');
  }

  create() {
    super.create();

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

    this.addToUpdateLoop(tristam, kevin, alicia);

    const tomatoCrop = new Crop(this, CropType.Corn, 200, 200);
    this.addToUpdateLoop(tomatoCrop);
  }
}
