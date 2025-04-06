export const TILE_SIZE = 50;
export const MAP_ROWS = 13;
export const MAP_COLS = 13;

export type Tile = {
    type: number;     // 0 = пусто, 1 = кирпич, 2 = база
    hp?: number;      // для кирпича
};

const rawMap: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
];

export const tilemap: Tile[][] = rawMap.map(row =>
    row.map(cell => ({
        type: cell,
        hp: cell === 1 ? 3 : undefined,
    }))
);

export function drawMap(ctx: CanvasRenderingContext2D) {
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = tilemap[row][col];

            if (tile.type === 1) {
                const hp = tile.hp ?? 0;
                const maxHp = 3;
                const t = 1 - hp / maxHp;

                const r = Math.floor(163 + (255 - 163) * t);
                const g = Math.floor(51 + (187 - 51) * t);
                const b = Math.floor(51 + (187 - 51) * t);

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }

            if (tile.type === 2) {
                ctx.fillStyle = "#0af";
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
