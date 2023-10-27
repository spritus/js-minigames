const W = 950, H = 550;

class Bombs extends Phaser.Scene {
    bomb;
    sling;
    constraint;
    slingLine1;
    slingLine2;
    status;
    touch;

    preload() {
        this.load.image("level1", "./assets/level1.png");
        this.load.spritesheet("bomb1", "./assets/sprites.png", { frameWidth: 16, frameHeight: 16, startFrame: 0, endFrame: 1 });
        this.load.spritesheet("bomb2", "./assets/sprites.png", { frameWidth: 48, frameHeight: 48, startFrame: 1, endFrame: 5 });
        this.load.spritesheet("sling", "./assets/sprites.png", { frameWidth: 48, frameHeight: 48, startFrame: 6, endFrame: 6 });
    }

    create() {
        const that = this;
        this.status = false;

        this.add.image(150, 0, "level1").setOrigin(0, 0);
        this.matter.world.setBounds(0, 0, W, H, true, true, false, true);
        const path = "112,547 800,549 800,241 785,243 765,233 746,238 728,257 726,292 694,351 680,375 626,376 610,363 587,355 567,349 563,327 543,306 545,238 523,214 497,212 467,214 441,242 441,299 441,330 439,351 397,385 392,325 374,303 340,309 330,340 330,472 317,485 300,499 234,522 179,525 146,533";
        const verts = this.matter.verts.fromPath(path);
        this.matter.add.fromVertices(696, 375, verts, { isStatic: true }, true, 0.01, 10);

        this.anims.create({
            key: "blink",
            frames: "bomb1",
            frameRate: 15,
            repeat: 20
        });

        this.anims.create({
            key: "boom",
            frames: "bomb2",
            frameRate: 15,
            repeat: 0
        });

        this.slingLine1 = this.add.line(0, 0, 0, 0, 0, 0, 0xffffff, 0.3).setOrigin(0);
        this.slingLine2 = this.add.line(0, 0, 0, 0, 0, 0, 0xffffff, 0.3).setOrigin(0);
        this.slingLine1.setLineWidth(2);
        this.slingLine2.setLineWidth(2);

        this.bomb = this.matter.add.sprite(200, 300, "bomb1");
        this.bomb.setCircle(10);
        this.bomb.setFixedRotation();
        this.bomb.setFriction(0);
        //this.bomb.setBounce(0.2);


        this.sling = this.matter.add.sprite(200, 300, "sling", 0, { isStatic: true, collisionFilter: 0 }).setOrigin(0.2, 0.2);

        /* this.bomb.on("animationcomplete", (a) => {
            console.log(a);
        }); */

        /* this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.bomb.play("boom");
            }
        }); */

        this.constraint = this.matter.add.constraint(this.sling.body, this.bomb.body, 20, 0.02);
        this.matter.add.mouseSpring();

        this.matter.add.circle(200, 300, 50, { isStatic: true });

        this.input.on("pointerup", () => {
            const sPos = that.sling.body.position;
            const bPos = that.bomb.body.position;
            if (Math.abs(bPos.x - sPos.x) > 30 || Math.abs(bPos.y - sPos.y) > 30) {
                setTimeout(() => {
                    that.constraint.bodyB = null;
                    that.status = true;
                    that.slingLine1.setTo(sPos.x, sPos.y, sPos.x + 5, sPos.y + 10);
                    that.slingLine2.setTo(sPos.x + 20, sPos.y, sPos.x + 5, sPos.y + 10);
                    that.bomb.body.ignorePointer = true;
                }, 70);
            }
        });

        this.bomb.on("animationcomplete", (e) => {
            if (e.key == "boom") {
                that.slingReset();
            }
        });

        this.matter.world.on("collisionstart", (e, a, b) => {
            if (b == that.bomb.body && !that.touch) {
                that.bomb.chain(["boom"]);
                that.bomb.play("blink");
                that.touch = true;
            }
        });
    }

    update() {
        const sPos = this.sling.body.position;
        const bPos = this.bomb.body.position;
        if (!this.status) {
            this.slingLine1.setTo(sPos.x, sPos.y, bPos.x, bPos.y);
            this.slingLine2.setTo(sPos.x + 20, sPos.y, bPos.x, bPos.y);
        }

        if (!this.touch && this.bomb.body.position.y > 600) {
            this.slingReset();
        }
    }

    slingReset() {
        this.touch = false;
        this.status = false;
        this.bomb.setPosition(200, 300);
        this.bomb.setTexture("bomb1");
        this.bomb.setVelocity(0);
        this.constraint.bodyB = this.bomb.body;
        this.bomb.body.ignorePointer = false;
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
            //debug: true,
            enableSleeping: true
        }
    },
    scene: Bombs
});