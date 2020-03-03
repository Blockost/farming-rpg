import * as Phaser from 'phaser';
import FacingDirection, { parseFacingDirection } from 'src/app/utils/facingDirection';
import TiledCollision from './tiledCollision';
import Player from '../player';

/**
 * Class that represents a Tiled transition (usually through a collision object)
 * from one scene to another.
 */
export default class TiledTransition extends TiledCollision {
  protected DEBUG_COLOR = 0x00ff00;
  protected DEBUG_ALPHA = 0.75;

  /**
   * The scene to transition to
   */
  private transitionTo: string;

  /**
   * The direction the player needs to be facing to in order to trigger the transition.
   */
  private transitionFacingStart: FacingDirection;

  /**
   * The direction the player will be facing to at the end of the transition when
   * the sceen has been rendered.
   */
  private transitionFacingEnd: FacingDirection;

  constructor(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject) {
    super(scene, tiledObject);

    this.transitionTo = tiledObject.properties.transitionTo;
    this.transitionFacingStart = parseFacingDirection(tiledObject.properties.transitionFacingStart);
    this.transitionFacingEnd = parseFacingDirection(tiledObject.properties.transitionFacingEnd);
  }

  onCollide(player: Player) {
    if (player.getFacingDirection() === this.transitionFacingStart) {
      console.log('Player is facing the right way. Initiating transition to next scene', this.transitionTo);
      // TODO: 2020-03-01 Blockost
    }
  }
}
