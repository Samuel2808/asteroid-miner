# Asteroid Miner

A short game you play in the terminal, for a quick break without leaving where
you work. It needs only Node.js 18 or newer: no installation, account, internet
connection or npm packages.

## What the game does

You steer a ship (`@`) across a 10 × 10 asteroid field from the top-left
corner to the goal (`G`) in the bottom-right corner. On the way, fly over
minerals to collect them:

| Symbol | Mineral | Points |
| ------ | ------- | ------ |
| `i`    | iron    | 1      |
| `g`    | gold    | 5      |
| `c`    | crystal | 10     |

Each move uses one unit of fuel and you start with 30. Reaching the goal wins
the game. Running out of fuel before you get there loses it. After every move
you see the grid, your score, the fuel left and the turn number. When the game
ends you get a summary of your final score and what you collected.

Controls: `W` up, `A` left, `S` down, `D` right, `Q` quit. Keys act
immediately. You don't need to press Enter.

## Run the game

From this `game/` folder, or from the repo's top folder, which passes the
command on to `game/`:

```bash
npm start
```

To replay the same asteroid field, pass the seed shown at the top of the screen:

```bash
npm start -- --seed 42
```

## Run the tests

```bash
npm test
```

## Project layout

- `src/rules.js` contains the game rules as pure functions.
- `src/render.js` turns a game state into text.
- `src/random.js` is the seeded random number generator.
- `src/main.js` handles keyboard input and screen output.
- `test/` holds the `node --test` tests. Each test name starts with its
  requirement ID.
- `spec.md` lists the requirements.
- `docs/decisions/` holds the decision records.
