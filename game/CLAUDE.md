# CLAUDE.md — Asteroid Miner

All commands run from this `game/` folder. `npm start` and `npm test` also
work from the repo's top folder, whose `package.json` passes them on here.

## Commands

- Run the game: `npm start` (or `node src/main.js [--seed N]`)
- Run the tests: `npm test` (runs `node --test`)

## Standing rules

- Node.js only, **no dependencies** (no `dependencies` or `devDependencies`).
- Game rules (moving, fuel, minerals, score, reaching the goal) live in pure
  functions in `src/rules.js`: no I/O, no `Math.random`, no mutation of inputs.
  Randomness comes in through an injected `rng` function.
- Write the test **before** the code. Every test name starts with the
  requirement ID from `spec.md` it checks, e.g. `R4: each move uses one fuel`.
- New behaviour needs a requirement in `spec.md` first.
- Commit in small steps; messages say what changed and why.
- Never undo, amend, rebase or force-push a commit.
- Record significant design choices in `docs/decisions/NNNN-title.md` as
  Y-statements.
