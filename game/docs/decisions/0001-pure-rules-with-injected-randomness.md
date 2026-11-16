# 0001 — Pure rule functions with injected randomness

Status: accepted · Date: 2026-11-16

## Decision (Y-statement)

In the context of **a terminal game whose rules (moving, fuel, minerals, score,
reaching the goal) must be tested before they are written**,
facing **the need for fast, repeatable tests and random asteroid layouts**,
we decided for **keeping all rules in pure functions in `src/rules.js` that take
a game state and return a new one, with randomness passed in as an `rng`
function (a seeded generator in the real game)**
and neglected **a class with mutable state that reads the keyboard and calls
`Math.random` directly**,
to achieve **tests that need no terminal, no mocks and no timing, and layouts
that can be replayed with `--seed`**,
accepting **that the terminal loop must thread the state through each call and
that the seeded generator is a small hand-written function rather than
`Math.random`**.

## Consequences

- `src/main.js` is the only file that touches stdin/stdout.
- `src/render.js` turns a state into a string and is also tested.
- `createGame({ rng })` with a fixed `rng` (or explicit `minerals`) gives exact
  layouts in tests.
