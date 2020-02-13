import * as Phaser from 'phaser';

interface TextStyle {
  centerX?: boolean;
  centerY?: boolean;
}

export default class TextStyleHelper {
  static forHeader(): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontSize: '64px', color: 'yellow', fontStyle: 'bold' };
  }

  static forSubheader(): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontSize: '32px', color: '#fff' };
  }

  static forParagraph(): Phaser.Types.GameObjects.Text.TextStyle {
    return { fontSize: '20px', color: '#fff' };
  }
}
