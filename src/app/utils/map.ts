import TiledCollision from '../objects/tiled/tiledCollision';
import TilemapHelper from './tiled/tilemapHelper';
import GameConfig from './gameConfig';
import TiledSpawnPoint from '../objects/tiled/tiledSpawnPoint';
import Player from '../objects/player';
import BaseScene from '../scenes/base.scene';

export default class Map {
  private tilemap: Phaser.Tilemaps.Tilemap;
  private collisions: TiledCollision[];

  /**
   *
   * @param scene The scene to attach the tilemap to
   */
  constructor(private scene: BaseScene) {
    // Create tilemap
    this.tilemap = scene.make.tilemap({ key: scene.mapKey });

    // Add tilesets
    this.tilemap.tilesets.forEach((tileset) => {
      console.log('Adding tileset', tileset.name);
      this.tilemap.addTilesetImage(tileset.name);
    });

    // Build layers. For now, we attach every tilesets to each layer because we don't have
    // a way (config) to know which tileset needs to be attached to which layer
    this.tilemap.layers.forEach((layer) => {
      const staticLayer = this.tilemap.createStaticLayer(layer.name, this.tilemap.tilesets);
      if (staticLayer.name === 'above_player') {
        staticLayer.setDepth(100);
      }
    });

    // If the map contains a layer called 'above_player', then renders it above everything else
    const abovePlayerLayer = this.tilemap.getLayer('above_player');
    if (abovePlayerLayer) {
      abovePlayerLayer.tilemapLayer.setDepth(100);
    }

    // Build collisions
    this.collisions = TilemapHelper.buildCollisions(scene, this.tilemap);

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

  getSpawnPoint(name: string): TiledSpawnPoint {
    return TilemapHelper.getSpawnPoint(this.tilemap, name);
  }

  enablesCollisionWithPlayer(player: Player) {
    this.collisions.forEach((collision) =>
      this.scene.physics.add.collider(player.getSprite(), collision, (obj1, obj2) => {
        (obj2 as TiledCollision).onCollide(player);
      })
    );
  }
}
