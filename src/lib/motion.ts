/** Shared motion language — one set of curves and durations for the whole site. */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const, // expo-out: entrances
  inOut: [0.76, 0, 0.24, 1] as const, // quart-in-out: wipes & transitions
};

export const dur = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
};
