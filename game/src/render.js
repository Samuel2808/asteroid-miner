// Turns a game state into text. Pure: no I/O here, main.js prints the result.
import { MINERAL_TYPES, score, summary } from './rules.js';

const samePlace = (a, b) => a.row === b.row && a.col === b.col;

/** R5: the grid, one character per square separated by spaces. */
export function renderGrid(state) {
  const rows = [];
  for (let row = 0; row < state.size; row++) {
    const cells = [];
    for (let col = 0; col < state.size; col++) {
      const here = { row, col };
      const mineral = state.minerals.find((m) => samePlace(m, here));
      if (samePlace(state.ship, here)) cells.push('@');
      else if (samePlace(state.goal, here)) cells.push('G');
      else if (mineral) cells.push(MINERAL_TYPES[mineral.type].symbol);
      else cells.push('.');
    }
    rows.push(cells.join(' '));
  }
  return rows.join('\n');
}

/** R5: score, fuel left and turn number. */
export function renderStatus(state) {
  return `Score: ${score(state)}   Fuel: ${state.fuel}   Turn: ${state.turn}`;
}

const LEGEND = 'W/A/S/D move   Q quit   @ ship  G goal  i iron(1)  g gold(5)  c crystal(10)';

/** R5: everything shown after each move. */
export function renderScreen(state, header = 'ASTEROID MINER') {
  return [header, '', renderGrid(state), '', renderStatus(state), LEGEND].join('\n');
}

const RESULT_TEXT = {
  won: 'You reached the goal!',
  lost: 'You ran out of fuel before reaching the goal.',
  quit: 'You quit.',
};

/** R6: end-of-game summary. */
export function renderSummary(state) {
  const s = summary(state);
  const lines = [
    RESULT_TEXT[s.result] ?? s.result,
    `Final score: ${s.score}   Turns: ${s.turns}   Fuel left: ${s.fuel}`,
    'Collected:',
  ];
  for (const [type, count] of Object.entries(s.counts)) {
    const pts = MINERAL_TYPES[type].points * count;
    lines.push(`  ${type.padEnd(8)} x${count}  (${pts} pts)`);
  }
  return lines.join('\n');
}
