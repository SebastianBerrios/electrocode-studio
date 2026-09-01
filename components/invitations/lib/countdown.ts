export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target instant has been reached or passed. */
  isPast: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const ZERO: CountdownParts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isPast: true,
};

/**
 * Split the time between `now` and `target` into calendar-free units.
 */
export function computeCountdown(target: number, now: number): CountdownParts {
  const remaining = target - now;

  if (remaining <= 0) return ZERO;

  return {
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
    isPast: false,
  };
}
