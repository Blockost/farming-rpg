import { CropType } from '../objects/crops/crop';
import LoadingBar from '../objects/loadingBar';
import ColorPaletteUtil, { Gender, HairStyle } from '../utils/colorPaletteUtil';
import EnumHelper from '../utils/enumHelper';
import Promisify from '../utils/promisify';
import SceneKey from './sceneKey';

export default class PreloaderScene extends Phaser.Scene {
  private loadingBar: LoadingBar;

  constructor() {
    super(SceneKey.PreloaderScene);
  }

  preload() {
    this.loadingBar = new LoadingBar(this);

    this.buildTextures();
    Promisify.doAsync(() => this.buildAnimations());
  }

  create() {
    // TODO: 2020-12-29 Blockost Add mouse/keyboard listener and load next scene when any key/button is pressed
  }

  private async buildTextures() {
    this.loadingBar.setProgress(0);

    await Promisify.doAsync(() => ColorPaletteUtil.createHairTextures(this, HairStyle.Xlongknot));
    this.loadingBar.setProgress(0.1);

    await Promisify.doAsync(() => ColorPaletteUtil.createHairTextures(this, HairStyle.Bangs));
    this.loadingBar.setProgress(0.2);

    await Promisify.doAsync(() => ColorPaletteUtil.createHairTextures(this, HairStyle.Mohawk));
    this.loadingBar.setProgress(0.3);

    await Promisify.doAsync(() => ColorPaletteUtil.createHairTextures(this, HairStyle.Messy1));
    this.loadingBar.setProgress(0.5);

    await Promisify.doAsync(() => ColorPaletteUtil.createSkinTextures(this, Gender.Male));
    this.loadingBar.setProgress(1);
  }

  private buildAnimations() {
    // Building animations for crops
    EnumHelper.extractNamesFromEnum(CropType).forEach((cropType, index) => {
      for (let growthStage = 0; growthStage < 5; growthStage++) {
        this.anims.create({
          key: `${cropType}_stage${growthStage}`,
          defaultTextureKey: 'crops',
          frames: [{ key: 'crops', frame: index * 5 + growthStage }]
        });
      }
    });

    // Building crop sparkles animation
    this.anims.create({
      key: 'sparkle',
      defaultTextureKey: 'crops_sparkles',
      frames: this.anims.generateFrameNumbers('crops_sparkles', { start: 0, end: 4 }),
      repeat: -1,
      frameRate: 10
    });

    // Building anumations for crops when picked
    EnumHelper.extractNamesFromEnum(CropType).forEach((cropType, index) => {
      this.anims.create({
        key: `${cropType}_picked`,
        defaultTextureKey: 'crops_picked',
        frames: [{ key: 'crops_picked', frame: index }]
      });
    });
  }
}
