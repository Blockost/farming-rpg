import * as Phaser from 'phaser';

import TiledSpawnPoint from 'src/app/objects/tiled/tiledSpawnPoint';

const SPAWN_POINT_KEY = 'spawn_points';

/**
 * Helper class to ease working with map created with Tiled.
 */
export default class TilemapHelper {
  /**
   * Retrieves the TiledSpawnPoint in the given tilemap based on the given name.
   */
  static getSpawnPoint(tilemap: Phaser.Tilemaps.Tilemap, name: string): TiledSpawnPoint {
    // XXX: 2020-02-15 Blockost Need to be converted to unknown first because there's no overlap between
    // Phaser GameObjects and objects created in Tiled
    return (tilemap.findObject(SPAWN_POINT_KEY, (obj) => obj.name === name) as unknown) as TiledSpawnPoint;
  }
}
