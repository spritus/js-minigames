const W = 950, H = 550;

class Bombs extends Phaser.Scene {
    preload() {
        this.load.image("level1", "./assets/level1.png");
        this.load.spritesheet("bomb", "./assets/sprites.png", { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1 });
    }

    create() {
        this.add.image(150, 0, "level1").setOrigin(0, 0);

    }
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: W,
    height: H,
    backgroundColor: "#000",
    parent: "game",
    physics: {
        default: "matter",
        matter: {
            debug: false,
            enableSleeping: true
        }
    },
    scene: Bombs
});