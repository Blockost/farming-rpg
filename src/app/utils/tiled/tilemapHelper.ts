import * as Phaser from 'phaser';

import TiledSpawnPoint from 'src/app/objects/tiled/tiledSpawnPoint';
import TiledCollision from 'src/app/objects/tiled/tiledCollision';
import TiledTransition from 'src/app/objects/tiled/tiledTransition';
import { parseFacingDirection } from '../facingDirection';

const SPAWN_POINT_LAYER_KEY = 'spawn_points';
const COLLISIONS_LAYER_KEY = 'collisions';

/**
 * Helper class to ease working with map created with Tiled.
 */
export default class TilemapHelper {
  /**
   * Retrieves the TiledSpawnPoint in the given tilemap based on the given name.
   */
  static getSpawnPoint(tilemap: Phaser.Tilemaps.Tilemap, name: string): TiledSpawnPoint {
    const tiledObjects = tilemap.objects.find((objectLayer) => objectLayer.name === SPAWN_POINT_LAYER_KEY).objects;
    const spawnPoint = tiledObjects.find((spawnPoint) => spawnPoint.name === name);

    if (!spawnPoint) {
      throw new Error(`Invalid spawn point name '${name}'`);
    }

    return {
      name: spawnPoint.name,
      x: spawnPoint.x,
      y: spawnPoint.y,
      facingDirection: parseFacingDirection(spawnPoint.properties.facingDirection)
    };
  }

  /**
   * Retrieves all collision objects defined in Tiled and creates a TiledCollision or TiledTransition
   * object. This object can then be used to create collisions with player or transition between
   * scenes.
   *
   * This method ignores invisible objects in Tiled.
   */
  static buildCollisions(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap): TiledCollision[] {
    const collisionObjects = tilemap.objects.find((objectLayer) => objectLayer.name === COLLISIONS_LAYER_KEY).objects;

    // Filter out non visible objects
    return collisionObjects
      .filter((obj) => obj.visible)
      .map((obj) => {
        if (obj.properties && obj.properties.transitionTo) {
          return new TiledTransition(scene, obj, obj.properties.targetSpawnPoint);
        }

        return new TiledCollision(scene, obj);
      });
  }
}
