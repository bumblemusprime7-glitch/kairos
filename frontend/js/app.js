// import only scenes here
import PreloaderScene from "./scenes/preloader.js";
import GameScene from "./scenes/game.js";
import UiOverlayScene from "./scenes/ui.js";

const world = new World();

const config = {
  type: Phaser.AUTO,
  parent: "phaser-game",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  audio: {
    disableWebAudio: false,
    noAudio: false,
  },
  scale: {
    width: world.roomSizeX,
    height: world.roomSizeY,
  },
  scene: [PreloaderScene, GameScene, UiOverlayScene],
};

const game = new Phaser.Game(config);
