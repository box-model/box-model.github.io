export const QUICK_MODE_LIMIT = 5;
// Animation speed slider: 0 is the slow end (one ticket per second),
// SPEED_MAX is the fast end (no animation at all).
export const SPEED_MIN = 0;
export const SPEED_MAX = 100;
export const SLOWEST_DRAW_TIME = 1000; // ms per ticket at the slow end
export const FASTEST_DRAW_TIME = 50; // ms per ticket just before "instant"
export const MODE = { WITH: "WITH", WITHOUT: "WITHOUT" };
export const APPLICATION_STEP = {
  SAMPLE: 1,
  AGGREGATE: 2,
  REPEAT: 3,
  ANALYZE: 4,
  DONE: 5
};
export const APPLICATION_LOCK = { PROCESSING: 1, NONE: 0, SAMPLING: 2 };
export const AGGREGATION_MODE = { SUM: "sum", MEAN: "mean" };
