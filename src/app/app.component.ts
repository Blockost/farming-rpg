import { Component } from '@angular/core';
import MainScene from './scenes/main.scene';
import GameConstants from './utils/gameConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private game: Phaser.Game;

  constructor() {
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GameConstants.width,
      height: GameConstants.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GameConstants.physics.gravity },
          debug: false
        }
      },
      scene: MainScene
    };

    this.game = new Phaser.Game(gameConfig);
  }
}
