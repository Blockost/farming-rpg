import { Component, OnInit } from '@angular/core';
import MainScene from './scenes/main.scene';
import GameConstants from './utils/gameConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private gameConfig: Phaser.Types.Core.GameConfig;
  private game: Phaser.Game;

  constructor() {
    this.gameConfig = {
      type: Phaser.AUTO,
      width: GameConstants.width,
      height: GameConstants.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GameConstants.physics.gravity },
          debug: GameConstants.physics.showEngineDebug
        }
      },
      scene: MainScene
    };
  }

  ngOnInit() {
    this.game = new Phaser.Game(this.gameConfig);
  }
}
