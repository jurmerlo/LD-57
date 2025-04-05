import { Camera, Scene } from '@jume-labs/lumi';

export class GameScene extends Scene {
  constructor() {
    super();
  }

  override drawWithCamera(camera: Camera): void {
    super.drawWithCamera(camera);

    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.circle('fill', 100, 100, 50);
  }
}
