import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, move, quit } from '../src/rules.js';
import { renderGrid, renderStatus, renderScreen, renderSummary } from '../src/render.js';

test('R5: grid shows ship, goal, minerals and empty squares', () => {
  const g = createGame({ minerals: [{ row: 0, col: 2, type: 'crystal' }, { row: 1, col: 0, type: 'iron' }] });
  const lines = renderGrid(g).split('\n');
  assert.equal(lines.length, 10);
  assert.equal(lines[0], '@ . c . . . . . . .');
  assert.equal(lines[1], 'i . . . . . . . . .');
  assert.equal(lines[9], '. . . . . . . . . G');
});

test('R5: status line shows score, fuel left and turn number', () => {
  const g = move(createGame({ minerals: [{ row: 0, col: 1, type: 'gold' }] }), 'd');
  assert.equal(renderStatus(g), 'Score: 5   Fuel: 29   Turn: 1');
});

test('R5: screen contains the grid and the status line', () => {
  const g = createGame({ minerals: [] });
  const screen = renderScreen(g);
  assert.ok(screen.includes(renderGrid(g)));
  assert.ok(screen.includes(renderStatus(g)));
});

test('R6: summary lists result, final score and each mineral collected', () => {
  const g = quit(
    move(
      createGame({ minerals: [{ row: 0, col: 1, type: 'gold' }, { row: 0, col: 2, type: 'gold' }] }),
      'd',
    ),
  );
  const text = renderSummary(move(g, 'd'));
  assert.match(text, /You quit/);
  assert.match(text, /Final score: 5/);
  assert.match(text, /iron\s+x0/);
  assert.match(text, /gold\s+x1/);
  assert.match(text, /crystal\s+x0/);
});

test('R6: summary says when the player won or ran out of fuel', () => {
  const won = move(createGame({ minerals: [], ship: { row: 9, col: 8 } }), 'd');
  assert.match(renderSummary(won), /reached the goal/);
  const lost = move(createGame({ minerals: [], fuel: 1 }), 'd');
  assert.match(renderSummary(lost), /ran out of fuel/);
});
