import { system } from '@minecraft/server';

import {
  ArrayQueue,
  createArrayQueue,
} from '@artifex/common/data-structures/array-queue';

import { JOB_PRIORITY, JobPriority } from './priorities';

interface SystemJobSchedulerOptions {
  /**
   * Queue switch threshold for each priority.
   */
  queueSwitch: [number, number, number];

  /**
   * Maximum iterations per job for high priority.
   */
  hp: { iterationsPerJob: number };

  /**
   * Maximum iterations per job for medium priority.
   */
  mp: { iterationsPerJob: number };

  /**
   * Maximum iterations per job for low priority.
   */
  lp: { iterationsPerJob: number };
  debug?: boolean;
}

interface JobProcess {
  generator: Generator;
}

/// Constants ///

const QUEUES: Record<JobPriority, ArrayQueue<JobProcess>> = {
  [JOB_PRIORITY.High]: createArrayQueue(),
  [JOB_PRIORITY.Medium]: createArrayQueue(),
  [JOB_PRIORITY.Low]: createArrayQueue(),
};

const QUEUE_SWITCH_THRESHOLD: Record<JobPriority, number> = {
  [JOB_PRIORITY.High]: 50,
  [JOB_PRIORITY.Medium]: 15,
  [JOB_PRIORITY.Low]: 3,
};

const MAX_ITERATIONS: Record<JobPriority, number> = {
  [JOB_PRIORITY.High]: 5,
  [JOB_PRIORITY.Medium]: 3,
  [JOB_PRIORITY.Low]: 1,
};

/// Dynamic variables ///

let SYSTEM_JOB_ID: number | undefined;

let CURRENT_PRIORITY: JobPriority = JOB_PRIORITY.High;
let CURRENT_PRIORITY_ITERATIONS = 0;
let CURRENT_PROCESS: JobProcess | undefined;
let CURRENT_PROCESS_ITERATIONS = 0;

/// Private functions ///

function* runJobs() {
  while (true) {
    CURRENT_PROCESS ??= getNextProcess();
    if (!CURRENT_PROCESS) {
      stop();

      return;
    }

    const { done } = CURRENT_PROCESS.generator.next();
    if (!done) {
      if (++CURRENT_PROCESS_ITERATIONS >= MAX_ITERATIONS[CURRENT_PRIORITY]) {
        CURRENT_PROCESS_ITERATIONS = 0;

        QUEUES[CURRENT_PRIORITY].enqueue(CURRENT_PROCESS);
        CURRENT_PROCESS = undefined;
      }
    } else {
      CURRENT_PROCESS = undefined;
    }
    yield;

    if (
      ++CURRENT_PRIORITY_ITERATIONS >= QUEUE_SWITCH_THRESHOLD[CURRENT_PRIORITY]
    ) {
      switchPriority();
    }
  }
}

function stop() {
  if (SYSTEM_JOB_ID) {
    system.clearJob(SYSTEM_JOB_ID);
    SYSTEM_JOB_ID = undefined;
  }

  CURRENT_PRIORITY = JOB_PRIORITY.High;
  CURRENT_PRIORITY_ITERATIONS = 0;
  CURRENT_PROCESS_ITERATIONS = 0;
  CURRENT_PROCESS = undefined;
}

/**
 * Get next priority in sequence.
 * @returns Next priority or undefined if no available queues.
 */
const PRIORITIES_SEQUENCE: JobPriority[] = [
  JOB_PRIORITY.High,
  JOB_PRIORITY.Medium,
  JOB_PRIORITY.Low,
];
function getNextPriority(): JobPriority | undefined {
  // Try to find any available queue in priority order.
  // Using 3 as a max because we have 3 priorities.
  const currentIndex = PRIORITIES_SEQUENCE.indexOf(CURRENT_PRIORITY);
  for (let i = 1; i <= 3; i++) {
    // Getting next priority in sequence.
    const nextPriority = PRIORITIES_SEQUENCE[(currentIndex + i) % 3];
    if (!QUEUES[nextPriority].isEmpty()) {
      return nextPriority;
    }
  }

  return undefined;
}

/**
 * Find next process to run.
 * @returns Next process or undefined if no available processes.
 */
function getNextProcess(): JobProcess | undefined {
  if (QUEUES[CURRENT_PRIORITY].isEmpty()) {
    switchPriority();
  }

  return QUEUES[CURRENT_PRIORITY].dequeue();
}

/**
 * Switch priority.
 */
function switchPriority() {
  const nextPriority = getNextPriority();
  if (nextPriority) {
    CURRENT_PRIORITY = nextPriority;
    CURRENT_PRIORITY_ITERATIONS = 0;
    CURRENT_PROCESS_ITERATIONS = 0;
    CURRENT_PROCESS = undefined;
  }
}

/// Public functions ///

/**
 * Register system job scheduler.
 * Updates configuration.
 *
 * @param options - Options for the system job scheduler.
 */
export function register(options: SystemJobSchedulerOptions) {
  const { queueSwitch, hp, mp, lp } = options;

  QUEUE_SWITCH_THRESHOLD[JOB_PRIORITY.High] = queueSwitch[0];
  QUEUE_SWITCH_THRESHOLD[JOB_PRIORITY.Medium] = queueSwitch[1];
  QUEUE_SWITCH_THRESHOLD[JOB_PRIORITY.Low] = queueSwitch[2];

  MAX_ITERATIONS[JOB_PRIORITY.High] = hp.iterationsPerJob;
  MAX_ITERATIONS[JOB_PRIORITY.Medium] = mp.iterationsPerJob;
  MAX_ITERATIONS[JOB_PRIORITY.Low] = lp.iterationsPerJob;
}

/**
 * Run system job scheduler.
 */
export function run() {
  SYSTEM_JOB_ID ??= system.runJob(runJobs());
}

/**
 * Add job to system job scheduler.
 *
 * @param job - Job to add.
 * @param priority - Priority of the job.
 * @param shouldRun - Whether to run the job immediately. `true` by default.
 */
export function add(
  job: Generator,
  priority: JobPriority,
  shouldRun: boolean = true,
) {
  const process: JobProcess = {
    generator: job,
  };

  QUEUES[priority].enqueue(process);

  if (shouldRun) run();
}

/**
 * Get stats of the system job scheduler.
 *
 * @returns Stats of the system job scheduler.
 */
export function getStats() {
  return {
    currentPriority: CURRENT_PRIORITY,
    priorityIterations: CURRENT_PRIORITY_ITERATIONS,
    queueSizes: {
      high: QUEUES[JOB_PRIORITY.High].length,
      medium: QUEUES[JOB_PRIORITY.Medium].length,
      low: QUEUES[JOB_PRIORITY.Low].length,
    },
  };
}

/**
 * Get count of jobs in the system job scheduler.
 *
 * @returns Count of jobs in the system job scheduler.
 */
export function jobsCount() {
  return QUEUES['high'].length + QUEUES['medium'].length + QUEUES['low'].length;
}
