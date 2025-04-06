import { drawMap } from "./game/map";
import { Player } from "./game/player";
import { Enemy } from "./game/enemy";
import { Explosion } from "./game/explosion";
import { Tank } from "./game/tank";
import { TILE_SIZE, MAP_COLS, MAP_ROWS } from "./game/map";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
canvas.width = TILE_SIZE * MAP_ROWS;
canvas.height = TILE_SIZE * MAP_COLS;

const keys = new Set<string>();
const player = new Player(6 * TILE_SIZE, 12 * TILE_SIZE);
const enemies = [
  new Enemy(0 * TILE_SIZE, 0),
  new Enemy(3 * TILE_SIZE, 0),
  new Enemy(6 * TILE_SIZE, 0),
  new Enemy(9 * TILE_SIZE, 0),
  new Enemy(12 * TILE_SIZE, 0),
];

let explosions: Explosion[] = [];

Tank.handleExplosion = (x, y) => explosions.push(new Explosion(x, y));

enemies.forEach(e => {
  e.onDeath = (x, y) => explosions.push(new Explosion(x, y));
});

document.addEventListener("keydown", (e) => {
  keys.add(e.key);
});
document.addEventListener("keyup", (e) => {
  keys.delete(e.key);
});
window.addEventListener("blur", () => keys.clear());

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  player.update(keys, enemies);
  enemies.forEach(e => e.update(player, [player, ...enemies]));

  enemies.forEach(enemy => {
    enemy.getBullets().forEach(b => {
      if (!b.active || !player.alive) return;

      const dx = (player.x + TILE_SIZE / 2) - (b.x + TILE_SIZE / 4);
      const dy = (player.y + TILE_SIZE / 2) - (b.y + TILE_SIZE / 4);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < TILE_SIZE / 2 && player.alive) {
        const killed = player.takeDamage(b.damage);
        b.active = false;
        if (killed) {
          explosions.push(new Explosion(player.x, player.y));
        }
      }
    });
  });

  // столкновение пуль
  player.getBullets().forEach(pb => {
    enemies.forEach(enemy => {
      enemy.getBullets().forEach(eb => {
        if (!pb.active || !eb.active) return;

        const dx = (pb.x + 8) - (eb.x + 8);
        const dy = (pb.y + 8) - (eb.y + 8);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8) {
          pb.active = false;
          eb.active = false;
          const x = (pb.x + eb.x) / 2;
          const y = (pb.y + eb.y) / 2;
          explosions.push(new Explosion(x, y));
        }
      });
    });
  });

  explosions = explosions.filter(e => e.isAlive);
  explosions.forEach(e => e.update());
}

function render() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMap(ctx);
  explosions.forEach(e => e.draw(ctx));
  player.draw(ctx);
  enemies.forEach(e => e.draw(ctx));
}

gameLoop();
