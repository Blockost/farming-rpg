import * as Phaser from 'phaser';
import FacingDirection, { parseFacingDirection } from 'src/app/utils/facingDirection';
import TiledCollision from './tiledCollision';
import Player from '../player';
import TransitionData from 'src/app/scenes/transitionData';
import SceneKey, { parseSceneKey } from 'src/app/scenes/sceneKey';

/**
 * Class that represents a Tiled transition (usually through a collision object)
 * from one scene to another.
 */
export default class TiledTransition extends TiledCollision {
  protected DEBUG_COLOR = 0x00ff00;

  /**
   * The scene to transition to.
   */
  private transitionTo: SceneKey;

  /**
   * The direction the player needs to be facing to in order to trigger the transition.
   */
  private activateOnFacing: FacingDirection;

  /**
   * Name of target spawn point where to spawn the player in the target scene.
   *
   * This must to be a valid spawn point object in the target map or it will fail
   * during map creation.
   */
  private targetSpawnPointName: string;

  constructor(scene: Phaser.Scene, tiledObject: Phaser.Types.Tilemaps.TiledObject, targetSpawnPointName: string) {
    super(scene, tiledObject);

    this.transitionTo = parseSceneKey(tiledObject.properties.transitionTo);
    this.activateOnFacing = parseFacingDirection(tiledObject.properties.activateOnFacing);
    this.targetSpawnPointName = targetSpawnPointName;
  }

  onCollide(player: Player) {
    if (player.getFacingDirection() === this.activateOnFacing) {
      const transitionData: TransitionData = {
        characterData: player.getData(),
        targetSpawnPointName: this.targetSpawnPointName
      };

      // this.scene.cameras.main.fadeOut(1000, 0, 0, 0, () => console.log('fading out'))

      this.scene.scene.sleep(this.scene.scene.key);
      this.scene.scene.run(this.transitionTo, transitionData);

      // this.scene.scene.transition({
      //   target: this.transitionTo,
      //   duration: 1000,
      //   onUpdate: this.onTransitionUpdate.bind(this),
      //   allowInput: false,
      //   sleep: true,
      //   data: { player: player }
      // });
    }
  }

  private onTransitionUpdate() {
    console.log('Performing transition');
  }
}
