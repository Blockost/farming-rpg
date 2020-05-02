import { PlayerData } from '../objects/characters/player';

/**
 * Data object to pass between scenes.
 */
export default interface TransitionData {
  playerData?: PlayerData;
  targetSpawnPointName?: string;
}
