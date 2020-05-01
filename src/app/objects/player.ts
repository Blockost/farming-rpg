import * as Phaser from 'phaser';
import Character, { CharacterData } from './characters/character';

export default class Player extends Character {
  constructor(scene: Phaser.Scene, config: CharacterData, registerAnimations = false) {
    super(scene, config, registerAnimations);
  }
}
