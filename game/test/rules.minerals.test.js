import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, move, quit, score, summary, layoutMinerals, MINERAL_TYPES } from '../src/rules.js';
import { seededRng } from '../src/random.js';

const play = (state, keys) => [...keys].reduce(move, state);

test('R3: moving onto a mineral collects it and removes it from the grid', () => {
  const g = play(createGame({ minerals: [{ row: 0, col: 1, type: 'gold' }] }), 'd');
  assert.deepEqual(g.minerals, []);
  assert.deepEqual(g.collected, ['gold']);
});

test('R3: squares without minerals collect nothing', () => {
  const g = play(createGame({ minerals: [{ row: 5, col: 5, type: 'gold' }] }), 'd');
  assert.equal(g.minerals.length, 1);
  assert.deepEqual(g.collected, []);
});

test('R3: reaching the goal ends the game with a win', () => {
  const g = play(createGame({ minerals: [] }), 'ddddddddds' + 'ssssssss');
  assert.deepEqual(g.ship, { row: 9, col: 9 });
  assert.equal(g.status, 'won');
  assert.equal(g.turn, 18);
});

test('R9: three mineral types worth 1, 5 and 10 points', () => {
  assert.equal(MINERAL_TYPES.iron.points, 1);
  assert.equal(MINERAL_TYPES.gold.points, 5);
  assert.equal(MINERAL_TYPES.crystal.points, 10);
});

test('R9: layout places 12 minerals, none on start or goal, none stacked', () => {
  for (let seed = 1; seed <= 50; seed++) {
    const minerals = layoutMinerals(seededRng(seed));
    assert.equal(minerals.length, 12);
    const keys = new Set(minerals.map((m) => `${m.row},${m.col}`));
    assert.equal(keys.size, 12, 'no two minerals share a square');
    assert.ok(!keys.has('0,0'), 'not on start');
    assert.ok(!keys.has('9,9'), 'not on goal');
    for (const m of minerals) assert.ok(m.type in MINERAL_TYPES);
  }
});

test('R10: score is the sum of points of collected minerals', () => {
  const g = play(
    createGame({
      minerals: [
        { row: 0, col: 1, type: 'iron' },
        { row: 0, col: 2, type: 'gold' },
        { row: 0, col: 3, type: 'crystal' },
      ],
    }),
    'ddd',
  );
  assert.equal(score(g), 16);
});

test('R10: a lost game keeps its score', () => {
  const g = play(createGame({ fuel: 1, minerals: [{ row: 0, col: 1, type: 'crystal' }] }), 'd');
  assert.equal(g.status, 'lost');
  assert.equal(score(g), 10);
});

test('R12: the same seed gives the same layout', () => {
  assert.deepEqual(layoutMinerals(seededRng(42)), layoutMinerals(seededRng(42)));
  assert.deepEqual(createGame({ rng: seededRng(7) }), createGame({ rng: seededRng(7) }));
});

test('R12: different seeds give different layouts', () => {
  assert.notDeepEqual(layoutMinerals(seededRng(1)), layoutMinerals(seededRng(2)));
});

test('R12: seededRng returns numbers in [0, 1)', () => {
  const rng = seededRng(123);
  for (let i = 0; i < 1000; i++) {
    const x = rng();
    assert.ok(x >= 0 && x < 1);
  }
});

test('R13: quit ends the game with result quit and keeps the score', () => {
  const g = quit(play(createGame({ minerals: [{ row: 0, col: 1, type: 'gold' }] }), 'd'));
  assert.equal(g.status, 'quit');
  assert.equal(score(g), 5);
  assert.deepEqual(move(g, 'd'), g, 'no moves after quitting');
});

test('R13: quit does not change a game that already ended', () => {
  const won = createGame({ minerals: [], ship: { row: 9, col: 8 } });
  const done = move(won, 'd');
  assert.deepEqual(quit(done), done);
});

test('R6: summary gives result, score and count of each mineral type', () => {
  const g = play(
    createGame({
      minerals: [
        { row: 0, col: 1, type: 'gold' },
        { row: 0, col: 2, type: 'gold' },
        { row: 0, col: 3, type: 'iron' },
      ],
    }),
    'ddd',
  );
  assert.deepEqual(summary(quit(g)), {
    result: 'quit',
    score: 11,
    turns: 3,
    fuel: 27,
    counts: { iron: 1, gold: 2, crystal: 0 },
  });
});
