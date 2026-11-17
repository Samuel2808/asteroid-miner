import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, move } from '../src/rules.js';

// A game with no minerals, so only movement and fuel matter.
const empty = (overrides = {}) => createGame({ minerals: [], ...overrides });

test('R7: grid is 10x10, ship starts top-left, goal is bottom-right', () => {
  const g = empty();
  assert.equal(g.size, 10);
  assert.deepEqual(g.ship, { row: 0, col: 0 });
  assert.deepEqual(g.goal, { row: 9, col: 9 });
  assert.equal(g.status, 'playing');
});

test('R8: ship starts with 30 fuel and turn 0', () => {
  const g = empty();
  assert.equal(g.fuel, 30);
  assert.equal(g.turn, 0);
});

test('R2: D moves right and S moves down by one square', () => {
  let g = empty();
  g = move(g, 'd');
  assert.deepEqual(g.ship, { row: 0, col: 1 });
  g = move(g, 's');
  assert.deepEqual(g.ship, { row: 1, col: 1 });
});

test('R2: A moves left and W moves up by one square', () => {
  let g = empty();
  g = move(move(g, 'd'), 's');
  g = move(g, 'a');
  assert.deepEqual(g.ship, { row: 1, col: 0 });
  g = move(g, 'w');
  assert.deepEqual(g.ship, { row: 0, col: 0 });
});

test('R2: capital letters move the same as lowercase', () => {
  const g = move(empty(), 'D');
  assert.deepEqual(g.ship, { row: 0, col: 1 });
});

test('R2: move does not change the state it was given', () => {
  const g = empty();
  move(g, 'd');
  assert.deepEqual(g.ship, { row: 0, col: 0 });
  assert.equal(g.fuel, 30);
});

test('R4: each move uses one unit of fuel and counts one turn', () => {
  const g = move(move(empty(), 'd'), 's');
  assert.equal(g.fuel, 28);
  assert.equal(g.turn, 2);
});

test('R4: running out of fuel before the goal loses the game', () => {
  let g = empty({ fuel: 2 });
  g = move(g, 'd');
  assert.equal(g.status, 'playing');
  g = move(g, 'd');
  assert.equal(g.fuel, 0);
  assert.equal(g.status, 'lost');
});

test('R4: reaching the goal with the last unit of fuel is a win', () => {
  let g = empty({ fuel: 1, ship: { row: 9, col: 8 } });
  g = move(g, 'd');
  assert.equal(g.fuel, 0);
  assert.equal(g.status, 'won');
});

test('R11: moving off the edge does nothing and uses no fuel', () => {
  const g = empty();
  for (const key of ['w', 'a']) {
    const after = move(g, key);
    assert.deepEqual(after.ship, { row: 0, col: 0 });
    assert.equal(after.fuel, 30);
    assert.equal(after.turn, 0);
  }
});

test('R11: an unknown key does nothing and uses no fuel', () => {
  const g = empty();
  const after = move(g, 'x');
  assert.deepEqual(after, g);
});

test('R11: moves after the game has ended do nothing', () => {
  const lost = move(empty({ fuel: 1 }), 'd');
  assert.equal(lost.status, 'lost');
  assert.deepEqual(move(lost, 'd'), lost);
});
