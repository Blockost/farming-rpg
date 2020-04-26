import { Injectable } from '@angular/core';
import BaseScene from '../scenes/base.scene';
import GameConfig from './gameConfig';
import { Game } from 'phaser';

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

const DEFAULT_SKIN_PALETTE = SkinPalette.Light;
const DEFAULT_HAIR_PALETTE = HairPalette.Black;

// Each color in a palette is a 16x16 square
const PALETTE_COLOR_WIDTH = 16;
const PALETTE_COLOT_HEIGHT = 16;

const SKIN_PALETTE_START_X = 140;
const SKIN_PALETTE_START_Y = 30;
const SKIN_PALETTE_WIDTH = 96;
const SKIN_PALETTE_HEIGHT = 176;

const HAIR_PALETTE_START_X = 138;
const HAIR_PALETTE_START_Y = 29;
const HAIR_PALETTE_WIDTH = 96;
const HAIR_PALETTE_HEIGHT = 400;

export default class ColorPaletteUtil {
  /**
   * Create different palette from a base spritesheet.
   */
  static createPalettes(scene: BaseScene, paletteKey: string, originalSpriteSheetKey: string) {
    const paletteNames = Object.keys(SkinPalette).filter((name) => isNaN(Number(name)));
    console.log(paletteNames);

    const numberOfColorInPalette = SKIN_PALETTE_WIDTH / PALETTE_COLOR_WIDTH;

    const colorLookup = new Map<string, Phaser.Display.Color[]>();

    // For each palette
    for (let i = 0; i < paletteNames.length; i++) {
      const currentPaletteName = paletteNames[i];
      console.log(`Retrieving colors for palette '${currentPaletteName}'`);

      const y = SKIN_PALETTE_START_Y + i * PALETTE_COLOT_HEIGHT;
      const colors: Phaser.Display.Color[] = [];

      for (let j = 0; j < numberOfColorInPalette; j++) {
        const x = SKIN_PALETTE_START_X + j * PALETTE_COLOR_WIDTH;

        const pixel = scene.textures.getPixel(x, y, paletteKey);
        colors.push(pixel);
      }
      colorLookup.set(currentPaletteName, colors);
    }

    const spriteSheetImage = scene.textures.get(originalSpriteSheetKey).getSourceImage() as HTMLCanvasElement;

    for (let i = 0; i < paletteNames.length; i++) {
      const currentPaletteName = paletteNames[i];
      console.log(`Creating new spritesheet for palette '${currentPaletteName}'`);

      // Create a temporary canvas to write image data onto it
      const canvasTexture = scene.textures.createCanvas(
        `${originalSpriteSheetKey}-temp-${currentPaletteName}`,
        spriteSheetImage.width,
        spriteSheetImage.height
      );

      const context = canvasTexture.getContext();
      context.drawImage(spriteSheetImage, 0, 0);
      const imageData = context.getImageData(0, 0, spriteSheetImage.width, spriteSheetImage.height);
      const pixelArray = imageData.data;

      // console.log(pixelArray);

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
          const oldPixelColor = colorLookup.get(DEFAULT_SKIN_PALETTE)[i];
          const newPixelColor = colorLookup.get(currentPaletteName)[i];

          // console.log('oldPixelColor', oldPixelColor);
          // console.log('newPixelColor', newPixelColor);
          // console.log('pixel from image', { r, g, b, alpha});

          if (r === oldPixelColor.red && g === oldPixelColor.green && b === oldPixelColor.blue) {
            // TODO: 2020-04-26 Blockost Should alpha be 255?

            pixelArray[--index] = newPixelColor.blue;
            pixelArray[--index] = newPixelColor.green;
            pixelArray[--index] = newPixelColor.red;
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

      // TODO: 2020-04-26 Blockost Temporary textures/images should be cleaned up here!
    }
  }
}
