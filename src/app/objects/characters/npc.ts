import BaseScene from 'src/app/scenes/base.scene';
import AbstractCharacter, { AbstractCharacterData } from './abstractCharacter';

/**
 * Custom data for NPCs
 */
export interface NonPlayableCharacterData {
  abstractCharacterData: AbstractCharacterData;
}

/**
 * Class implementation of NPCs in the game.
 */
export default class NonPlayableCharacter extends AbstractCharacter {
  constructor(scene: BaseScene, data: NonPlayableCharacterData, registerAnimations = false) {
    super(scene, data.abstractCharacterData, registerAnimations);

    // Add some basic wandering movement with a bunch a random stuff to make NPCs look more alive
    // and less like brainless robots.
    // These timers will be paused/resumed when scene is put to sleep/waking up
    const randomDelay = Math.random() * 3000 + 3000;
    scene.time.addEvent({
      delay: randomDelay,
      loop: true,
      callbackScope: this,
      callback: () => {
        // TODO: 2020-12-29 Blockost Add different logging level and add a global level parameter in gameConfig.ts
        // console.log(`${data.abstractCharacterData.name} is choosing where to move`);
        const randomDirection = Math.random();
        const randomDuration = Math.random() * 100 + 300;
        if (randomDirection < 0.2) this.setMovement(true, false, false, false, randomDuration);
        else if (randomDirection < 0.4) this.setMovement(false, true, false, false, randomDuration);
        else if (randomDirection < 0.6) this.setMovement(false, false, true, false, randomDuration);
        else if (randomDirection < 0.8) this.setMovement(false, false, false, true, randomDuration);
        else this.setMovement(false, false, false, false);
      }
    });
  }
}
