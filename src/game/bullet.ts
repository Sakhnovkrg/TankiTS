import { TILE_SIZE, tilemap, MAP_COLS, MAP_ROWS } from "./map";

export type Direction = "up" | "down" | "left" | "right";

const directionDeltas: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export class Bullet {
  x: number;
  y: number;
  readonly direction: Direction;
  readonly speed = 4;
  readonly damage: number;
  active = true;
  onExplode?: (x: number, y: number) => void;

  constructor(x: number, y: number, direction: Direction, damage = 1) {
    this.x = x + TILE_SIZE / 4;
    this.y = y + TILE_SIZE / 4;
    this.direction = direction;
    this.damage = damage;
  }

  update() {
    const [dx, dy] = directionDeltas[this.direction];
    this.x += dx * this.speed;
    this.y += dy * this.speed;

    const col = Math.floor(this.x / TILE_SIZE);
    const row = Math.floor(this.y / TILE_SIZE);

    if (col < 0 || row < 0 || col >= MAP_COLS || row >= MAP_ROWS) {
      this.active = false;
      return;
    }

    const tile = tilemap[row][col];

    if (tile.type === 1) {
      tile.hp = Math.max(0, (tile.hp ?? 0) - this.damage);
      if (tile.hp <= 0) {
        tile.type = 0;
        tile.hp = undefined;
      }

      this.active = false;
      this.onExplode?.(col * TILE_SIZE, row * TILE_SIZE);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;

    ctx.fillStyle = "#ff0";
    ctx.beginPath();
    ctx.arc(this.x + TILE_SIZE / 4, this.y + TILE_SIZE / 4, TILE_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
