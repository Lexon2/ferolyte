export type JobPriority = (typeof JOB_PRIORITY)[keyof typeof JOB_PRIORITY];

export const JOB_PRIORITY = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
} as const;
