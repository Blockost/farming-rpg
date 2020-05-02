import BaseScene from '../scenes/base.scene';
import GameConfig from './gameConfig';

export const extractNamesFromEnum = (enumarated: any) => {
  return Object.keys(enumarated)
    .filter((name) => isNaN(Number(name)))
    .map((name) => name.toLowerCase());
};

export enum HairStyle {
  Bangs = 'bangs',
  Loose = 'loose',
  Mohawk = 'mohawk',
  Messy1 = 'messy1',
  Messy2 = 'messy2',
  Xlongknot = 'xlongknot'
}

export enum SkinPalette {
  Light = 'light',
  Tanned = 'tanned',
  Tanned2 = 'tanned2',
  Dark = 'dark',
  Dark2 = 'dark2',
  DarkElf = 'darkelf',
  DarkElf2 = 'darkelf2',
  Albino = 'albino',
  Albino2 = 'albino2',
  Orc = 'orc',
  RedOrc = 'redorc'
}

export enum HairPalette {
  Default = 'default',
  Black = 'black',
  Blonde = 'blonde',
  Blonde2 = 'blonde2',
  Blue = 'blue',
  Blue2 = 'blue2',
  Brown = 'brown',
  Brunette = 'brunette',
  Brunette2 = 'brunette2',
  DarkBlonde = 'darkblonde',
  Gray = 'gray',
  Green = 'green',
  Green2 = 'green2',
  LightBlonde = 'lightblonde',
  LightBlonde2 = 'lightblonde2',
  Pink = 'pink',
  Pink2 = 'pink2',
  Raven = 'raven',
  Raven2 = 'raven2',
  Redhead = 'redhead',
  RubyRed = 'rubyred',
  White = 'white',
  WhiteBlonde = 'whiteblonde',
  WhiteBlonde2 = 'whiteblonde2',
  WhiteCyan = 'whitecyan'
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Skeleton = 'skeleton'
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
  names: extractNamesFromEnum(SkinPalette),
  defaultColor: SkinPalette.Light,
  colorWidth: 16,
  colorHeight: 16,
  startAt: { x: 140, y: 30 },
  width: 96,
  height: 176
};

const HAIR_PALETTE_CONFIG: PaletteConfig<HairPalette> = {
  names: extractNamesFromEnum(HairPalette),
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
  static createSkinTextures(scene: BaseScene, paletteKey: string, baseSkinTexture: string) {
    // TODO: Support different gender
    ColorPaletteUtil.createPalettes(scene, paletteKey, SKIN_PALETTE_CONFIG, baseSkinTexture);
  }

  static createHairTextures(scene: BaseScene, paletteKey: string, baseHairTexture: HairStyle) {
    ColorPaletteUtil.createPalettes(scene, paletteKey, HAIR_PALETTE_CONFIG, baseHairTexture);
  }

  /**
   * Create different palette from a base spritesheet.
   */
  static createPalettes<T extends SkinPalette | HairPalette>(
    scene: BaseScene,
    paletteKey: string,
    paletteConfig: PaletteConfig<T>,
    baseTexture: string
  ) {
    const numberOfColorInPalette = paletteConfig.width / paletteConfig.colorWidth;

    const colorLookup = new Map<string, Phaser.Display.Color[]>();

    // Create a map for colors
    for (let i = 0; i < paletteConfig.names.length; i++) {
      const currentPaletteName = paletteConfig.names[i];

      const y = paletteConfig.startAt.y + i * paletteConfig.colorHeight;
      const colors: Phaser.Display.Color[] = [];

      for (let j = 0; j < numberOfColorInPalette; j++) {
        const x = paletteConfig.startAt.x + j * paletteConfig.colorWidth;

        const pixel = scene.textures.getPixel(x, y, paletteKey);
        colors.push(pixel);
      }
      colorLookup.set(currentPaletteName, colors);
    }

    const baseImage = scene.textures.get(baseTexture).getSourceImage() as HTMLCanvasElement;

    for (let i = 0; i < paletteConfig.names.length; i++) {
      const currentPaletteName = paletteConfig.names[i];

      // Create a temporary canvas to write image data onto it
      const tempTextureName = `${baseTexture}-temp-${currentPaletteName}`;
      const canvasTexture = scene.textures.createCanvas(tempTextureName, baseImage.width, baseImage.height);

      const context = canvasTexture.getContext();
      context.imageSmoothingEnabled = false;
      context.drawImage(baseImage, 0, 0);
      const imageData = context.getImageData(0, 0, baseImage.width, baseImage.height);
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

      const spriteSheetFromPalette = `${baseTexture}-${currentPaletteName}`;
      console.log(`Adding '${spriteSheetFromPalette}' to TextureManager`);
      scene.textures.addSpriteSheet(spriteSheetFromPalette, canvasTexture.getSourceImage() as HTMLImageElement, {
        frameWidth: GameConfig.sprite.character.width,
        frameHeight: GameConfig.sprite.character.height
      });

      // Destroy temporary canvas
      scene.textures.get(tempTextureName).destroy();
    }

    // TODO: Can't destroy palette at the moment since it may be used
    // to load other hairstyles.

    // TODO: Need to think about generating spritehseets on demand
    // scene.textures.get(paletteKey).destroy();

    // Destroy original texture
    scene.textures.get(baseTexture).destroy();
  }
}
