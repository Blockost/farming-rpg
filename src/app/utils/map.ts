import TiledCollision from '../objects/tiled/tiledCollision';
import GameConfig from './gameConfig';
import TiledSpawnPoint from '../objects/tiled/tiledSpawnPoint';
import Player from '../objects/player';
import BaseScene from '../scenes/base.scene';
import { parseFacingDirection } from './facingDirection';
import TiledTransition from '../objects/tiled/tiledTransition';

const SPAWN_POINT_LAYER_KEY = 'spawn_points';
const COLLISIONS_LAYER_KEY = 'collisions';
const ABOVE_PLAYER_LAYER_KEY = 'above_player';

/**
 * Wrapper class to work with maps built with Tiled.
 */
export default class Map {
  private tilemap: Phaser.Tilemaps.Tilemap;
  private collisions: TiledCollision[];

  /**
   * Constructor.
   *
   * @param scene The scene to attach the tilemap to
   */
  constructor(private scene: BaseScene) {
    // Create tilemap
    this.tilemap = scene.make.tilemap({ key: scene.mapKey });

    // Add tilesets
    this.tilemap.tilesets.forEach((tileset) => {
      this.tilemap.addTilesetImage(tileset.name);
    });

    // Build layers. For now, we attach every tilesets to each layer because we don't have
    // a way (config) to know which tileset needs to be attached to which layer
    this.tilemap.layers.forEach((layer) => {
      const staticLayer = this.tilemap.createStaticLayer(layer.name, this.tilemap.tilesets);
      if (staticLayer.name === ABOVE_PLAYER_LAYER_KEY) {
        staticLayer.setDepth(100);
      }
    });

    // If the map contains a layer called 'above_player', then renders it above everything else
    const abovePlayerLayer = this.tilemap.getLayer(ABOVE_PLAYER_LAYER_KEY);
    if (abovePlayerLayer) {
      abovePlayerLayer.tilemapLayer.setDepth(100);
    }

    // Build collisions
    this.collisions = this.buildCollisions(scene, this.tilemap);

    // If debug set to true, fill rectangle with debug color
    if (GameConfig.physics.showCollisionObjectsDebug) {
      this.collisions.forEach((tiledCollision) => tiledCollision.showDebug());
    }
  }

  getWidth(): number {
    return this.tilemap.width;
  }

  getHeight(): number {
    return this.tilemap.height;
  }

  /**
   * Retrieves the TiledSpawnPoint in the given tilemap based on the given name.
   */
  getSpawnPoint(name: string): TiledSpawnPoint {
    const tiledObjects = this.tilemap.objects.find((objectLayer) => objectLayer.name === SPAWN_POINT_LAYER_KEY).objects;
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
   * Enables interactions between Player and collision objects in the map.
   */
  enablesCollisionWithPlayer(player: Player) {
    this.collisions.forEach((collision) =>
      this.scene.physics.add.collider(player.getSprite(), collision, (obj1, obj2) => {
        (obj2 as TiledCollision).onCollide(player);
      })
    );
  }

  /**
   * Retrieves all collision objects defined in Tiled and creates a TiledCollision or TiledTransition
   * object. This object can then be used to create collisions with player or transition between
   * scenes.
   *
   * This method ignores invisible objects in Tiled.
   */
  private buildCollisions(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap): TiledCollision[] {
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
