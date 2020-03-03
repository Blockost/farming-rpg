import { Component, OnInit } from '@angular/core';
import MainScene from './scenes/main.scene';
import GameConfig from './utils/gameConfig';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private gameConfig: Phaser.Types.Core.GameConfig;

  constructor() {
    this.gameConfig = {
      type: Phaser.AUTO,
      width: GameConfig.width,
      height: GameConfig.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: GameConfig.physics.gravity },
          debug: GameConfig.physics.showEngineDebug
        }
      },
      scene: MainScene
    };
  }

  ngOnInit() {
    // Start the game
    new Phaser.Game(this.gameConfig);
  }
}
