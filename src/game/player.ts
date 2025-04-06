import { Tank, Direction } from "./tank";
import { TILE_SIZE } from "./map";

export class Player extends Tank {
    hp = 3;
    speed = 4;
    cooldownMax = 10;

    constructor(x: number, y: number) {
        super(x, y);
    }

    update(keys: Set<string>, others: Tank[]) {
        if (!this.alive) return;

        if (keys.has(" ")) {
            keys.delete(" ");
            this.shoot();
        }

        if (!this.moving) {
            if (keys.has("w")) this.tryMove("up", others);
            else if (keys.has("s")) this.tryMove("down", others);
            else if (keys.has("a")) this.tryMove("left", others);
            else if (keys.has("d")) this.tryMove("right", others);
        } else {
            this.continueMove();
        }

        this.updateBullets();
    }

    tryMove(dir: Direction, others: Tank[]) {
        this.direction = dir;

        const [dx, dy] = this.getDelta();
        const nextX = this.x + dx * TILE_SIZE;
        const nextY = this.y + dy * TILE_SIZE;

        if (
            !this.collidesWithMap(nextX, nextY) &&
            !this.collidesWithTanks(nextX, nextY, others)
        ) {
            this.moving = true;
            this.moveProgress = 0;
        }
    }

    continueMove() {
        const [dx, dy] = this.getDelta();
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        this.moveProgress += this.speed;

        if (this.moveProgress >= TILE_SIZE) {
            this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
            this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;
            this.moving = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.alive) return;
        this.drawBase(ctx, "#0f0");
    }
}
