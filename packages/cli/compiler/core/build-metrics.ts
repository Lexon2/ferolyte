export type BuildPhase = 'bundle' | 'eval' | 'write';

const phases: Record<BuildPhase, number> = { bundle: 0, eval: 0, write: 0 };

/**
 * Accumulated phase durations of the content pipeline (`eval`/`write` are
 * sums over entries, which run concurrently).
 */
export const resetBuildMetrics = (): void => {
  phases.bundle = 0;
  phases.eval = 0;
  phases.write = 0;
};

export const addPhaseTime = (phase: BuildPhase, ms: number): void => {
  phases[phase] += ms;
};

export const getBuildMetrics = (): Readonly<Record<BuildPhase, number>> => ({
  ...phases,
});
