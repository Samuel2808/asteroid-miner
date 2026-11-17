// Pure game rules. No I/O and no Math.random: every function returns a new
// state and never changes the one it was given. See docs/decisions/0001.

export const SIZE = 10; // R7
export const START_FUEL = 30; // R8
export const MINERAL_COUNT = 12; // R9

// R9: symbol shown on the grid and points scored.
export const MINERAL_TYPES = {
  iron: { symbol: 'i', points: 1 },
  gold: { symbol: 'g', points: 5 },
  crystal: { symbol: 'c', points: 10 },
};

// How often each type appears when laying out minerals: commoner = cheaper.
const TYPE_WEIGHTS = [
  ['iron', 6],
  ['gold', 4],
  ['crystal', 2],
];

const DIRECTIONS = {
  w: { row: -1, col: 0 },
  a: { row: 0, col: -1 },
  s: { row: 1, col: 0 },
  d: { row: 0, col: 1 },
};

const samePlace = (a, b) => a.row === b.row && a.col === b.col;
const onGrid = (p, size) => p.row >= 0 && p.row < size && p.col >= 0 && p.col < size;

function pickType(rng) {
  const total = TYPE_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [type, w] of TYPE_WEIGHTS) {
    if (r < w) return type;
    r -= w;
  }
  return TYPE_WEIGHTS[0][0];
}

/** R9: place MINERAL_COUNT minerals on distinct squares, avoiding start and goal. */
export function layoutMinerals(rng, size = SIZE) {
  const free = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const isStart = row === 0 && col === 0;
      const isGoal = row === size - 1 && col === size - 1;
      if (!isStart && !isGoal) free.push({ row, col });
    }
  }
  // Partial Fisher–Yates shuffle: the first MINERAL_COUNT squares are chosen.
  for (let i = 0; i < MINERAL_COUNT; i++) {
    const j = i + Math.floor(rng() * (free.length - i));
    [free[i], free[j]] = [free[j], free[i]];
  }
  return free.slice(0, MINERAL_COUNT).map((p) => ({ ...p, type: pickType(rng) }));
}

/**
 * Create a new game.
 * @param {object} [options]
 * @param {() => number} [options.rng] random source used for the layout when `minerals` is not given
 * @param {Array<{row:number,col:number,type:string}>} [options.minerals] explicit mineral layout
 * @param {number} [options.fuel] starting fuel
 * @param {{row:number,col:number}} [options.ship] starting position
 */
export function createGame({ rng, minerals, fuel = START_FUEL, ship = { row: 0, col: 0 } } = {}) {
  const layout = minerals ?? (rng ? layoutMinerals(rng) : []);
  return {
    size: SIZE,
    ship: { ...ship },
    goal: { row: SIZE - 1, col: SIZE - 1 },
    fuel,
    turn: 0,
    minerals: layout.map((m) => ({ ...m })),
    collected: [],
    status: 'playing',
  };
}

/** Apply one key press (R2, R3, R4, R11). */
export function move(state, key) {
  const dir = DIRECTIONS[String(key).toLowerCase()];
  if (!dir || state.status !== 'playing') return state;

  const ship = { row: state.ship.row + dir.row, col: state.ship.col + dir.col };
  if (!onGrid(ship, state.size)) return state;

  const found = state.minerals.find((m) => samePlace(m, ship));
  const minerals = found ? state.minerals.filter((m) => m !== found) : state.minerals;
  const collected = found ? [...state.collected, found.type] : state.collected;

  const fuel = state.fuel - 1;
  let status = 'playing';
  if (samePlace(ship, state.goal)) status = 'won';
  else if (fuel <= 0) status = 'lost';

  return { ...state, ship, fuel, turn: state.turn + 1, minerals, collected, status };
}

/** R13: end the game early. A finished game is left as it is. */
export function quit(state) {
  return state.status === 'playing' ? { ...state, status: 'quit' } : state;
}

/** R10: total points of everything collected. */
export function score(state) {
  return state.collected.reduce((sum, type) => sum + MINERAL_TYPES[type].points, 0);
}

/** R6: what the end screen reports. */
export function summary(state) {
  const counts = Object.fromEntries(Object.keys(MINERAL_TYPES).map((t) => [t, 0]));
  for (const type of state.collected) counts[type] += 1;
  return { result: state.status, score: score(state), turns: state.turn, fuel: state.fuel, counts };
}
