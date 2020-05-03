import BaseScene from 'src/app/scenes/base.scene';
import UpdatableObject from '../updatableObject';

export enum CropType {
  Tomato = 'Tomato',
  Potato = 'Potato',
  Carrot = 'Carrot',
  Artichoke = 'Artichoke',
  Chilli = 'Chilli',
  Gourd = 'Gourd',
  Corn = 'Corn'
}

interface CropProperties {
  type: CropType;
  growthStageDuration: number;
  maxGrowthStage: number;
  price: number;
}

const CROPS_PROPERTIES: CropProperties[] = [
  { type: CropType.Tomato, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Potato, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Carrot, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Artichoke, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Chilli, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Gourd, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 },
  { type: CropType.Corn, growthStageDuration: 3000, maxGrowthStage: 4, price: 30 }
];

export default class Crop implements UpdatableObject {
  private properties: CropProperties;
  private currentGrowthStage = 0;
  private cropSprite: Phaser.GameObjects.Sprite;
  private sparklesSpriteGroup: Phaser.GameObjects.Group;

  constructor(scene: BaseScene, type: CropType, x: number, y: number) {
    this.properties = CROPS_PROPERTIES.find((cropProperty) => cropProperty.type === type);
    if (!this.properties) {
      throw new Error(`Crop type ${type} does not have properties yet`);
    }

    // Every crop has the same sprite. What differs is which part of the spritesheet we're
    // drawing based on cropType and growthStage. Animations are already registered for each,
    // we just need to play the right one
    this.cropSprite = scene.add.sprite(x, y, 'crops');

    // Sparkles to be displayed on fully grown crops
    this.sparklesSpriteGroup = scene.add.group();
    for (let i = 0; i < 4; i++) {
      const sparkleSprite = scene.add.sprite(
        x + Math.random() * 25 - 10,
        y + Math.random() * 50 - 25,
        'crops_sparkles'
      );
      sparkleSprite.setActive(false).setVisible(false);
      this.sparklesSpriteGroup.add(sparkleSprite);
    }

    // Add a scene time to simulate crop's growth
    // TODO: Timer will be paused when scene is sleeping which is probably not what we want
    // Obviously, we would like growth to continue even if the player is currently in another scene
    // On way to do it would be to have a crop manager attached to another scene that never sleeps
    scene.time.addEvent({
      delay: this.properties.growthStageDuration,
      repeat: this.properties.maxGrowthStage - 1,
      callbackScope: this,
      callback: () => ++this.currentGrowthStage
    });
  }

  update(time: number, delta: number): void {
    this.cropSprite.play(`${this.properties.type}_stage${this.currentGrowthStage}`, true);

    if (this.currentGrowthStage === this.properties.maxGrowthStage) {
      this.sparklesSpriteGroup
        .getChildren()
        .forEach((sparkleSprite: Phaser.GameObjects.Sprite) =>
          sparkleSprite.setActive(true).setVisible(true).play('sparkle', true)
        );
    }
  }

  destroy() {
    this.cropSprite.destroy();
    this.sparklesSpriteGroup.destroy(true);
  }
}
