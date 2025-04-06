import { Tank, Direction } from "./tank";
import { TILE_SIZE } from "./map";

const KeyBindings = {
    up: new Set(["w", "W", "ц", "Ц", "ArrowUp"]),
    down: new Set(["s", "S", "ы", "Ы", "ArrowDown"]),
    left: new Set(["a", "A", "ф", "Ф", "ArrowLeft"]),
    right: new Set(["d", "D", "в", "В", "ArrowRight"]),
    shoot: new Set([" ", "Space"]),
};

export class Player extends Tank {
    hp = 3;
    speed = 4;
    cooldownMax = 10;

    constructor(x: number, y: number) {
        super(x, y);
    }

    update(keys: Set<string>, others: Tank[]) {
        if (!this.alive) return;
    
        if ([...KeyBindings.shoot].some(k => keys.has(k))) {
            KeyBindings.shoot.forEach(k => keys.delete(k));
            this.shoot();
        }
    
        if (!this.moving) {
            if ([...KeyBindings.up].some(k => keys.has(k))) this.tryMove("up", others);
            else if ([...KeyBindings.down].some(k => keys.has(k))) this.tryMove("down", others);
            else if ([...KeyBindings.left].some(k => keys.has(k))) this.tryMove("left", others);
            else if ([...KeyBindings.right].some(k => keys.has(k))) this.tryMove("right", others);
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
