#!/usr/bin/env node
// Terminal loop: the only file that reads the keyboard or prints (R1).
import { createGame, move, quit } from './rules.js';
import { seededRng } from './random.js';
import { renderScreen, renderSummary } from './render.js';

function parseSeed(argv) {
  const i = argv.indexOf('--seed');
  if (i !== -1) {
    const n = Number(argv[i + 1]);
    if (!Number.isInteger(n)) {
      console.error('Usage: node src/main.js [--seed <integer>]');
      process.exit(1);
    }
    return n >>> 0;
  }
  return (Date.now() ^ (process.pid << 16)) >>> 0;
}

const seed = parseSeed(process.argv.slice(2));
let state = createGame({ rng: seededRng(seed) });
const interactive = process.stdin.isTTY;

function draw() {
  const clear = interactive ? '\x1b[2J\x1b[H' : '';
  process.stdout.write(clear + renderScreen(state, `ASTEROID MINER   (seed ${seed})`) + '\n');
}

function finish() {
  process.stdout.write('\n' + renderSummary(state) + '\n');
  if (interactive) process.stdin.setRawMode(false);
  process.stdin.pause();
}

function handleKey(key) {
  if (state.status !== 'playing') return;
  // Q or Ctrl+C quits (R13); everything else goes through the rules.
  const next = key === 'q' || key === 'Q' || key === '\u0003' ? quit(state) : move(state, key);
  if (next === state) return; // R11: ignored keys do not redraw
  state = next;
  draw();
  if (state.status !== 'playing') finish();
}

draw();
if (interactive) process.stdin.setRawMode(true); // keys act without Enter
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  for (const key of chunk) handleKey(key);
});
process.stdin.on('end', () => {
  if (state.status === 'playing') {
    state = quit(state);
    finish();
  }
});
