// Pure game rules. No I/O and no Math.random: every function returns a new
// state and never changes the one it was given. See docs/decisions/0001.

export const SIZE = 10; // R7
export const START_FUEL = 30; // R8

const DIRECTIONS = {
  w: { row: -1, col: 0 },
  a: { row: 0, col: -1 },
  s: { row: 1, col: 0 },
  d: { row: 0, col: 1 },
};

/**
 * Create a new game.
 * @param {object} [options]
 * @param {Array<{row:number,col:number,type:string}>} [options.minerals] explicit mineral layout
 * @param {number} [options.fuel] starting fuel
 * @param {{row:number,col:number}} [options.ship] starting position
 */
export function createGame({ minerals = [], fuel = START_FUEL, ship = { row: 0, col: 0 } } = {}) {
  return {
    size: SIZE,
    ship: { ...ship },
    goal: { row: SIZE - 1, col: SIZE - 1 },
    fuel,
    turn: 0,
    minerals: minerals.map((m) => ({ ...m })),
    status: 'playing',
  };
}

const samePlace = (a, b) => a.row === b.row && a.col === b.col;
const onGrid = (p, size) => p.row >= 0 && p.row < size && p.col >= 0 && p.col < size;

/** Apply one key press (R2, R4, R11). */
export function move(state, key) {
  const dir = DIRECTIONS[String(key).toLowerCase()];
  if (!dir || state.status !== 'playing') return state;

  const ship = { row: state.ship.row + dir.row, col: state.ship.col + dir.col };
  if (!onGrid(ship, state.size)) return state;

  const fuel = state.fuel - 1;
  let status = 'playing';
  if (samePlace(ship, state.goal)) status = 'won';
  else if (fuel <= 0) status = 'lost';

  return { ...state, ship, fuel, turn: state.turn + 1, status };
}
