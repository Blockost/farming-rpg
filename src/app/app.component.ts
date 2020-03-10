import { Component, OnInit } from '@angular/core';
import FarmExteriorScene from './scenes/farm-exterior.scene';
import GameConfig from './utils/gameConfig';
import FarmHouseFloorScene from './scenes/farm-house-floor.scene';
import FarmHouseBedroomScene from './scenes/farm-house-bedroom.scene';

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
      scene: [FarmExteriorScene, FarmHouseFloorScene, FarmHouseBedroomScene]
    };
  }

  ngOnInit() {
    // Start the game
    new Phaser.Game(this.gameConfig);
  }
}
