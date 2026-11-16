# Asteroid Miner — Specification

Source: `../problem.md` (R1–R6). R7–R12 refine those requirements with the
defaults chosen when the clarifying questions were answered with "go".

## Requirements

- **R1** — The game runs in the terminal with `node`, and needs no installation,
  account, internet connection or npm dependencies. Node.js 18 or newer.
- **R2** — The ship moves one square per turn on the grid. `W` up, `A` left,
  `S` down, `D` right. Lowercase and capital letters both work.
- **R3** — Minerals lie on the grid. Moving onto a mineral collects it (the
  square becomes empty). Reaching the goal square ends the game with a win.
- **R4** — Every successful move uses exactly one unit of fuel. If fuel reaches 0
  and the ship is not on the goal, the game is lost. Reaching the goal with the
  last unit of fuel is a win.
- **R5** — After every move the screen shows the grid, the score, the fuel left
  and the turn number.
- **R6** — When the game ends it shows the result (won, lost or quit), the final
  score, and how many of each mineral type were collected.
- **R7** — The grid is 10 × 10. The ship starts in the top-left corner (row 0,
  column 0); the goal is the bottom-right corner (row 9, column 9).
- **R8** — The ship starts with 30 fuel. There are no fuel pickups.
- **R9** — There are three mineral types: iron (`i`, 1 point), gold (`g`,
  5 points) and crystal (`c`, 10 points). 12 minerals are placed per game, never
  on the start or the goal square, and never two on the same square.
- **R10** — The score is the sum of the points of collected minerals. A lost or
  quit game still shows its score.
- **R11** — A move off the edge of the grid, an unknown key, or any move after
  the game has ended does nothing: no fuel used, no turn counted.
- **R12** — The layout is random. Passing `--seed <number>` makes it repeatable:
  the same seed always gives the same layout.
- **R13** — `Q` quits at any time; the game ends with result "quit".

## Display

Plain ASCII, one character per square separated by spaces:
`@` ship, `G` goal, `i` / `g` / `c` minerals, `.` empty.
Keys act immediately (no Enter needed) when the terminal supports raw mode.

## Out of scope

Obstacles, fuel pickups, colours, high-score saving, play-again prompt.
