/**
 * Defines a Game Object that can be updated during the scene update loop.
 */
export default interface UpdatableObject {
  /**
   * Main update loop that will be called by the scene for each object it owns.
   */
  update(time: number, delta: number): void;
}
