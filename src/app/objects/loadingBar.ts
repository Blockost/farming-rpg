/**
 * Loading bar creates a loading bar which fills as the assets are loaded.
 */
export default class LoadingBar {
  private static readonly PROGRESS_BOX_COLOR = new Phaser.Display.Color(220, 220, 220).color;
  private static readonly PROGRESS_BAR_COLOR = new Phaser.Display.Color(214, 48, 116).color;
  private static readonly BOX_WIDTH = 700;
  private static readonly BOX_HEIGHT = 50;
  private static readonly BAR_OFFSET = 10;

  private progressBar: Phaser.GameObjects.Graphics;
  private scene: Phaser.Scene;

  public constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const progressBox = this.scene.add.graphics();
    progressBox.fillStyle(LoadingBar.PROGRESS_BOX_COLOR, 0.8);
    progressBox.fillRect(
      scene.sys.canvas.width / 2 - LoadingBar.BOX_WIDTH / 2,
      (scene.sys.canvas.height / 3) * 2 - LoadingBar.BOX_HEIGHT / 2,
      LoadingBar.BOX_WIDTH,
      LoadingBar.BOX_HEIGHT
    );

    this.progressBar = this.scene.add.graphics();
    this.progressBar.fillStyle(LoadingBar.PROGRESS_BAR_COLOR, 1);
  }

  setProgress(progress: number) {
    this.progressBar.fillRect(
      this.scene.sys.canvas.width / 2 - LoadingBar.BOX_WIDTH / 2 + LoadingBar.BAR_OFFSET,
      (this.scene.sys.canvas.height / 3) * 2 - LoadingBar.BOX_HEIGHT / 2 + LoadingBar.BAR_OFFSET,
      (LoadingBar.BOX_WIDTH - LoadingBar.BAR_OFFSET * 2) * progress,
      LoadingBar.BOX_HEIGHT - LoadingBar.BAR_OFFSET * 2
    );
  }
}
