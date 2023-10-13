const W = 950, H = 550;

class Bombs extends Phaser.Scene {
    preload() {
        this.load.image("level1", "./assets/level1.png");
        this.load.spritesheet("bomb", "./assets/sprites.png", { frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1 });
    }

    create() {
        this.add.image(150, 0, "level1").setOrigin(0, 0);
        this.matter.world.setBounds(0, 0, W, H, true, true, false, true);
        const path = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";
        const verts = this.matter.verts.fromPath(path);
        this.matter.add.fromVertices(696, 375, verts, { isStatic: true }, true, 0.01, 10);

        const bomb = this.matter.add.image(500, 0, "bomb", 5);
        bomb.setCircle();
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
            debug: true,
            enableSleeping: true
        }
    },
    scene: Bombs
});