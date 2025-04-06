import { TILE_SIZE, tilemap, MAP_COLS, MAP_ROWS } from "./map";
import { Bullet } from "./bullet";

export type Direction = "up" | "down" | "left" | "right";

export const directionDeltas: Record<Direction, [number, number]> = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
};

export abstract class Tank {
    x: number;
    y: number;
    direction: Direction = "up";
    speed = 2;
    firePower = 1;
    cooldownMax = 20;
    cooldown = 0;

    alive = true;
    hp = 3;
    maxHp = 3;

    protected bullets: Bullet[] = [];

    moving = false;
    moveProgress = 0;

    static handleExplosion: (x: number, y: number) => void;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    getBullets(): Bullet[] {
        return this.bullets;
    }

    getDelta(): [number, number] {
        return directionDeltas[this.direction];
    }

    shoot(): void {
        if (this.cooldown > 0) return;

        const bullet = new Bullet(this.x, this.y, this.direction, this.firePower);

        bullet.onExplode = (x, y) => {
            Tank.handleExplosion?.(x, y);
        };

        this.bullets.push(bullet);
        this.cooldown = this.cooldownMax;
    }

    updateBullets(): void {
        this.cooldown = Math.max(0, this.cooldown - 1);
        this.bullets = this.bullets.filter(b => b.active);
        this.bullets.forEach(b => b.update());
    }

    takeDamage(amount: number): boolean {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }

    collidesWithMap(x: number, y: number): boolean {
        const col = Math.floor(x / TILE_SIZE);
        const row = Math.floor(y / TILE_SIZE);

        if (col < 0 || row < 0 || col >= MAP_COLS || row >= MAP_ROWS) return true;

        const tile = tilemap[row][col];
        return tile.type === 1 || tile.type === 2;
    }

    collidesWithTanks(x: number, y: number, others: Tank[]): boolean {
        for (const other of others) {
            if (other === this || !other.alive) continue;

            const dx = Math.abs(x - other.x);
            const dy = Math.abs(y - other.y);

            if (dx < TILE_SIZE && dy < TILE_SIZE) {
                return true;
            }
        }

        return false;
    }

    drawBase(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, TILE_SIZE, TILE_SIZE);

        const centerX = this.x + TILE_SIZE / 2;
        const centerY = this.y + TILE_SIZE / 2;

        this.drawBarrel(ctx, centerX, centerY);
        this.drawHpBar(ctx);
        this.bullets.forEach(b => b.draw(ctx));
    }

    drawHpBar(ctx: CanvasRenderingContext2D) {
        if (this.hp >= this.maxHp || this.maxHp <= 1) return;

        const barWidth = TILE_SIZE;
        const barHeight = 4;
        const percent = Math.max(0, this.hp / this.maxHp);

        // Цвет: зелёный → жёлтый → красный
        let r = percent < 0.5 ? 255 : Math.floor(255 * (1 - percent) * 2);
        let g = percent > 0.5 ? 255 : Math.floor(255 * percent * 2);
        let b = 50;

        const color = `rgb(${r}, ${g}, ${b})`;

        ctx.fillStyle = "#000";
        ctx.fillRect(this.x, this.y - barHeight - 2, barWidth, barHeight);

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y - barHeight - 2, barWidth * percent, barHeight);
    }


    private drawBarrel(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
        ctx.fillStyle = "#222";
        const barrelLength = TILE_SIZE / 2;
        const barrelWidth = TILE_SIZE / 6;

        switch (this.direction) {
            case "up":
                ctx.fillRect(centerX - barrelWidth / 2, this.y - barrelLength / 4, barrelWidth, barrelLength);
                break;
            case "down":
                ctx.fillRect(centerX - barrelWidth / 2, this.y + TILE_SIZE - barrelLength + barrelLength / 4, barrelWidth, barrelLength);
                break;
            case "left":
                ctx.fillRect(this.x - barrelLength / 4, centerY - barrelWidth / 2, barrelLength, barrelWidth);
                break;
            case "right":
                ctx.fillRect(this.x + TILE_SIZE - barrelLength + barrelLength / 4, centerY - barrelWidth / 2, barrelLength, barrelWidth);
                break;
        }
    }
}
