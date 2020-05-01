import { CharacterData } from '../objects/characters/character';

/**
 * Data object to pass between scenes.
 */
export default interface TransitionData {
  characterData?: CharacterData;
  targetSpawnPointName?: string;
}
