import { TILE_SIZE } from "./map";

export class Explosion {
  x: number;
  y: number;
  lifetime = 15;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.lifetime--;
  }

  get isAlive(): boolean {
    return this.lifetime > 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.lifetime / 15;
    const radius = TILE_SIZE * (1.2 - alpha);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ff6";
    ctx.beginPath();
    ctx.arc(this.x + TILE_SIZE / 2, this.y + TILE_SIZE / 2, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
