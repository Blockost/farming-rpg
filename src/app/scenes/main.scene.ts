import BaseScene from './base.scene';
import { SceneKeys } from './sceneKeys';

export default class MainScene extends BaseScene {
  constructor() {
    super(SceneKeys.MainScene);
  }

  preload() {
    super.preload();

    this.load.setBaseURL('http://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    super.create();

    this.add.image(400, 300, 'sky');

    const particleEmitterManager = this.add.particles('red');
    const emitter = particleEmitterManager.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    const logo = this.physics.add.image(100, 100, 'logo');
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
    logo.setGravityY(-200);

    emitter.startFollow(logo);
  }
}
