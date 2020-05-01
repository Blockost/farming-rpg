import * as Phaser from 'phaser';
import { GameEvent } from '../utils/gameEvent';
import TransitionData from './transitionData';
import Player, { PlayerData } from '../objects/player';
import SceneKey from './sceneKey';
import Map from '../utils/map';

const LOCAL_STORAGE_PLAYER_DATA_KEY = 'PLAYER_DATA';

export default abstract class BaseScene extends Phaser.Scene {
  /**
   * The scene's unique identifier.
   */
  readonly key: SceneKey;

  /**
   * The key used when loading the json map using `tilemapTiledJSON()`.
   *
   * This is mandatory or else the scene won't be able to load its tile map.
   */
  readonly mapKey: string;

  /**
   * Current player
   */
  protected player: Player;

  /**
   * Cursor keys to control player.
   */
  protected cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  /**
   * Data from the scene it is transitioning from.
   *
   * Note that this resolves to an empty object {} for the first scene started.
   */
  protected transitionData: TransitionData;

  // TODO: 2020-03-10 Blockost Maybe map should be auto-created in this base scene
  // and child classes just implement method to build layers and collisions
  /**
   * Scene tile map.
   *
   * This should be assigned in the Scene's create method.
   */
  protected map: Map;

  private customUpdateList: Phaser.GameObjects.GameObject[] = [];

  constructor(key: SceneKey, mapKey: string, config?: Phaser.Types.Scenes.SettingsConfig) {
    super({ key, ...config });
    this.key = key;
    this.mapKey = mapKey;
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   *
   * @param data Data from the scene it is transitioning from. Note that this resolves to an
   * empty object {} for the first scene started.
   */
  init(data: TransitionData) {
    console.log(`Initializing ${this.key} with transition data: `, data);
    this.transitionData = data;

    this.load.addListener('progress', () => {
      const progress = this.load.progress;
      if (!isNaN(progress)) {
        // TODO: 2020-02-05 Blockost Maybe add a progress bar somewhere?
        console.log(`Progress: ${progress * 100}%`);
      }
    });

    // Add listeners for custom objects to be updated and destroyed
    this.events.on(GameEvent.NEW_OBJECT_TO_UPDATE, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.push(object);
    });

    this.events.on(GameEvent.OBJECT_DESTROYED, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.splice(this.customUpdateList.indexOf(object), 1);
    });

    this.events.on(GameEvent.SCENE_SLEEP, this.onSceneSleep.bind(this));
    this.events.on(GameEvent.SCENE_WAKE, this.onSceneWake.bind(this));
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  preload() {}

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  create() {
    console.log(`Creating ${this.key}`);
    this.cursors = this.input.keyboard.createCursorKeys();

    if (this.transitionData.playerData) {
      this.player = this.buildPlayerFromData(this.transitionData.playerData);
    }
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   *
   * @param time the current time. Either a High Resolution Timer value if it comes from Request Animation
   * Frame, or Date.now using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based
   *  on the FPS rate.
   */
  update(time: number, delta: number) {
    this.customUpdateList.forEach((object) => object.update(time, delta));
    this.player.update(time, delta, this.cursors);
  }

  protected onSceneSleep() {
    console.log(`${this.key} is sleeping...`);
    // destroy player before sleeping since it will be re-created when scene wake up
    this.player.getGroup().destroy(true);
    this.input.keyboard.resetKeys();
  }

  protected onSceneWake(systems: Phaser.Scenes.Systems, data: TransitionData) {
    console.log(`${this.key} is waking up`, data);
    const spawnPoint = this.map.getSpawnPoint(data.targetSpawnPointName);

    this.player = this.buildPlayerFromData(data.playerData);
    this.map.updatePlayer(this.player);
    this.player.spawnAt(spawnPoint);
  }

  private buildPlayerFromData(playerData: PlayerData): Player {
    console.log('Building player from data');

    if (!playerData) {
      throw new Error('No player data passed to scene');
    }

    return new Player(this, playerData);
  }

  private dumpPlayerData() {
    const playerData = this.player.getData();
    console.log('Saving player data in localStorage', playerData);
    localStorage.setItem(LOCAL_STORAGE_PLAYER_DATA_KEY, JSON.stringify(playerData));
  }
}
