import { Tank, Direction } from "./tank";
import { TILE_SIZE } from "./map";
import { Bullet } from "./bullet";
import { Player } from "./player";

export class Enemy extends Tank {
  speed = 1;
  onDeath?: (x: number, y: number) => void;

  constructor(x: number, y: number) {
    super(x, y);
    this.direction = this.randomDirection();
    this.hp = 3; // 👈 Устанавливаем здоровье
  }

  update(player: Player, others: Tank[]) {
    if (!this.alive) return;

    if (!this.moving) {
      if (Math.random() < 0.02) {
        this.direction = this.randomDirection();
      }
      this.tryMove(others);
    } else {
      this.continueMove();
    }

    if (Math.random() < 0.01 && this.cooldown === 0) {
      this.shoot();
    }

    this.updateBullets();
    this.checkHit(player.getBullets());
  }

  tryMove(others: Tank[]) {
    const [dx, dy] = this.getDelta();
    const nextX = this.x + dx * TILE_SIZE;
    const nextY = this.y + dy * TILE_SIZE;

    if (
      !this.collidesWithMap(nextX, nextY) &&
      !this.collidesWithTanks(nextX, nextY, others)
    ) {
      this.moving = true;
      this.moveProgress = 0;
    } else {
      this.direction = this.randomDirection();
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

  checkHit(bullets: Bullet[]) {
    for (const bullet of bullets) {
      if (!bullet.active) continue;

      const dx = (this.x + 16) - (bullet.x + 8);
      const dy = (this.y + 16) - (bullet.y + 8);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < TILE_SIZE / 2) {
        const killed = this.takeDamage(bullet.damage);
        bullet.active = false;

        if (killed && this.onDeath) {
          this.onDeath(this.x, this.y);
        }

        return;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.alive) return;
    this.drawBase(ctx, "#f00");
  }

  private randomDirection(): Direction {
    const dirs: Direction[] = ["up", "down", "left", "right"];
    return dirs[Math.floor(Math.random() * dirs.length)];
  }
}
