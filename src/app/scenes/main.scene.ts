import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';
import Player from '../objects/player';
import GameConstants from '../utils/gameConstants';

export default class MainScene extends BaseScene {
  private player: Player;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(SceneKeys.MainScene);
  }

  preload() {
    super.preload();

    this.load.spritesheet('player', '/assets/spritesheets/light.png', {
      frameWidth: GameConstants.sprite.width,
      frameHeight: GameConstants.sprite.height
    });
  }

  create() {
    super.create();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, 'player');
  }

  update(time: number, delta: number) {
    super.update(time, delta);

    this.player.update(time, delta, this.cursors);
  }
}
