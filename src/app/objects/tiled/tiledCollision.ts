import * as Phaser from 'phaser';
import Player from '../player';

/**
 * Class that reprensents a collision object in Tiled
 */
export default class TiledCollision extends Phaser.GameObjects.Rectangle {
  protected DEBUG_COLOR = 0xf38630;
  protected DEBUG_ALPHA = 0.75;

  constructor(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject) {
    super(scene, tiledObject.x, tiledObject.y, tiledObject.width, tiledObject.height);

    // XXX: 2020-03-01 Blockost Arcade physics only support collisions with rectangle shapes.
    // It is possible to render more complex shapes like polygons but its physics body will still
    // be a rectangle. If there's a need to enable collisions with more complex shapes, we'll need
    // to switch to Matter.js
    if (!tiledObject.rectangle) {
      throw new Error(
        'Arcade physics only support collisions with rectangle shapes. ' +
          'Please, use rectangle objects to define collitions in Tiled.'
      );
    }

    // Update origin from (0.5, 0.5) to (0, 0) because that's how it works in Tiled
    this.setOrigin(0, 0);

    // Add a static Arcade body to the rectangle. We set the body to static because
    // world collisions are not supposed to move
    scene.physics.add.existing(this, true) as Phaser.GameObjects.Rectangle;
  }

  onCollide(player: Player) {
    // Do nothing
  }

  showDebug(): void {
    // TODO: 2020-03-01 Blockost Tjis is not working. Find out why
    this.setFillStyle(this.DEBUG_COLOR, this.DEBUG_ALPHA);
  }
}
