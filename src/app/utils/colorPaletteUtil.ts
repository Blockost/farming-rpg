import BaseScene from '../scenes/base.scene';
import GameConfig from './gameConfig';

export enum HairStyle {
  Bangs = 'bangs',
  Mohawk = 'mohawk'
}

export enum SkinPalette {
  Light = 'Light',
  Tanned = 'Tanned',
  Tanned2 = 'Tanned2',
  Dark = 'Dark',
  Dark2 = 'Dark2',
  DarkElf = 'DarkElf',
  DarkElf2 = 'DarkElf2',
  Albino = 'Albino',
  Albino2 = 'Albino2',
  Orc = 'Orc',
  RedOrc = 'RedOrc'
}

export enum HairPalette {
  Default = 'Default',
  Black = 'Black',
  Blonde = 'Blonde',
  Blonde2 = 'Blonde2',
  Blue = 'Blue',
  Blue2 = 'Blue2',
  Brown = 'Brown',
  Brunette = 'Brunette',
  Brunette2 = 'Brunette2',
  DarkBlonde = 'DarkBlonde',
  Gray = 'Gray',
  Green = 'Green',
  Green2 = 'Green2',
  LightBlonde = 'LightBlonde',
  LightBlonde2 = 'LightBlonde2',
  Pink = 'Pink',
  Pink2 = 'Pink2',
  Raven = 'Raven',
  Raven2 = 'Raven2',
  Redhead = 'Redhead',
  RubyRed = 'RubyRed',
  White = 'White',
  WhiteBlonde = 'WhiteBlonde',
  WhiteBlonde2 = 'WhiteBlonde2',
  WhiteCyan = 'WhiteCyan'
}

interface PaletteConfig<T extends SkinPalette | HairPalette> {
  names: string[];
  defaultColor: T;
  colorWidth: number;
  colorHeight: number;
  startAt: { x: number; y: number };
  width: number;
  height: number;
}

const SKIN_PALETTE_CONFIG: PaletteConfig<SkinPalette> = {
  names: Object.keys(SkinPalette).filter((name) => isNaN(Number(name))),
  defaultColor: SkinPalette.Light,
  colorWidth: 16,
  colorHeight: 16,
  startAt: { x: 140, y: 30 },
  width: 96,
  height: 176
};

const HAIR_PALETTE_CONFIG: PaletteConfig<HairPalette> = {
  names: Object.keys(HairPalette).filter((name) => isNaN(Number(name))),
  defaultColor: HairPalette.Black,
  colorWidth: 16,
  colorHeight: 16,
  startAt: { x: 138, y: 29 },
  width: 96,
  height: 400
};

/**
 * Util class to dynamically create spritesheets with color from palettes.
 *
 * TODO: 2020-04-27 Blockost This might be turned into a reusable service for dealing with color palettes
 * and sprites in the future.
 */
export default class ColorPaletteUtil {
  static createSkinPalettes(scene: BaseScene, paletteKey: string, originalSpriteSheetKey: string) {
    ColorPaletteUtil.createPalettes(scene, paletteKey, SKIN_PALETTE_CONFIG, originalSpriteSheetKey);
  }

  static createHairPalettes(scene: BaseScene, paletteKey: string, originalSpriteSheetKey: string) {
    ColorPaletteUtil.createPalettes(scene, paletteKey, HAIR_PALETTE_CONFIG, originalSpriteSheetKey);
  }

  /**
   * Create different palette from a base spritesheet.
   */
  static createPalettes<T extends SkinPalette | HairPalette>(
    scene: BaseScene,
    paletteKey: string,
    paletteConfig: PaletteConfig<T>,
    originalSpriteSheetKey: string
  ) {
    const numberOfColorInPalette = paletteConfig.width / paletteConfig.colorWidth;

    const colorLookup = new Map<string, Phaser.Display.Color[]>();

    // TODO: Skip spritesheet generation for default palette, since we already have it in assets folder

    // For each palette
    for (let i = 0; i < paletteConfig.names.length; i++) {
      const currentPaletteName = paletteConfig.names[i];
      console.log(`Retrieving colors for palette '${currentPaletteName}'`);

      const y = paletteConfig.startAt.y + i * paletteConfig.colorHeight;
      const colors: Phaser.Display.Color[] = [];

      for (let j = 0; j < numberOfColorInPalette; j++) {
        const x = paletteConfig.startAt.x + j * paletteConfig.colorWidth;

        const pixel = scene.textures.getPixel(x, y, paletteKey);
        colors.push(pixel);
      }
      colorLookup.set(currentPaletteName, colors);
    }

    const spriteSheetImage = scene.textures.get(originalSpriteSheetKey).getSourceImage() as HTMLCanvasElement;

    for (let i = 0; i < paletteConfig.names.length; i++) {
      const currentPaletteName = paletteConfig.names[i];
      console.log(`Creating new spritesheet for palette '${currentPaletteName}'`);

      // Create a temporary canvas to write image data onto it
      const tempTextureName = `${originalSpriteSheetKey}-temp-${currentPaletteName}`;
      const canvasTexture = scene.textures.createCanvas(
        tempTextureName,
        spriteSheetImage.width,
        spriteSheetImage.height
      );

      const context = canvasTexture.getContext();
      context.imageSmoothingEnabled = false;
      context.drawImage(spriteSheetImage, 0, 0);
      const imageData = context.getImageData(0, 0, spriteSheetImage.width, spriteSheetImage.height);
      const pixelArray = imageData.data;

      // Iterate over each pixels of the canvas image
      for (let p = 0; p < pixelArray.length / 4; p++) {
        // In the array, each pixel is split into 4 distinct parts (RGBa)
        let index = 4 * p;
        const r = pixelArray[index];
        const g = pixelArray[++index];
        const b = pixelArray[++index];
        const alpha = pixelArray[++index];

        // If the pixel is fully transparent, skip it
        if (alpha === 0) {
          continue;
        }

        // Iterate through each color in the palette and replace it with the color
        // at the same index in the other palette (pixel swapping)
        for (let i = 0; i < numberOfColorInPalette; i++) {
          const oldPixelColor = colorLookup.get(paletteConfig.defaultColor)[i];
          const newPixelColor = colorLookup.get(currentPaletteName)[i];

          if (r === oldPixelColor.red && g === oldPixelColor.green && b === oldPixelColor.blue) {
            // TODO: 2020-04-26 Blockost Should alpha be 255?

            pixelArray[--index] = newPixelColor.blue;
            pixelArray[--index] = newPixelColor.green;
            pixelArray[--index] = newPixelColor.red;

            // XXX: 2020-04-30 /!\ Nasty bug: Skip other color in palette since we already found a match!
            break;
          }
        }
      }

      // Put the new image (with the pixels taken from the new palette) into the canvas
      context.putImageData(imageData, 0, 0);

      const spriteSheetFromPalette = `${originalSpriteSheetKey}-${currentPaletteName}`;
      console.log(`Adding '${spriteSheetFromPalette}' to TextureManager`);
      scene.textures.addSpriteSheet(spriteSheetFromPalette, canvasTexture.getSourceImage() as HTMLImageElement, {
        frameWidth: GameConfig.sprite.width,
        frameHeight: GameConfig.sprite.height
      });

      // Destroy temporary canvas
      scene.textures.get(tempTextureName).destroy();
    }

    // Destroy palette and original spritesheet
    scene.textures.get(paletteKey).destroy();
    scene.textures.get(originalSpriteSheetKey).destroy();
  }
}
