import FacingDirection from 'src/app/utils/facingDirection';

/**
 * Spawn point object created in Tiled.
 */
export default interface TiledSpawnPoint {
  name?: string;
  x: number;
  y: number;
  facingDirection: FacingDirection;
}
