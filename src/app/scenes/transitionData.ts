import Player from '../objects/player';

/**
 * Data object to pass between scenes.
 */
export default interface TransitionData {
  player?: Player;
  targetSpawnPointName?: string;
}
