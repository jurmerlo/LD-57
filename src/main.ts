import { Game } from '@jume-labs/lumi';

import { GameScene } from './scenes/gameScene';

if (os.getenv('LOCAL_LUA_DEBUGGER_VSCODE') === '1') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('lldebugger').start();
}

Game.start({
  designSize: { width: 720, height: 1080 },
  name: 'LD 57',
  scene: GameScene,
});
