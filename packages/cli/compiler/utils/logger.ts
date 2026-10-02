export type LogLevel = 'quiet' | 'normal' | 'verbose';

let level: LogLevel = 'normal';

/**
 * Single place for console output of the compiler and the CLI commands.
 * Writes go through `console.*` at call time, so commands that move human
 * output to stderr (`--json`) by reassigning `console.log` keep working.
 * Plugins keep their own logging (`[ferolyte:plugin:<name>]`).
 */
export const logger = {
  get level(): LogLevel {
    return level;
  },

  setLevel(next: LogLevel): void {
    level = next;
  },

  get isVerbose(): boolean {
    return level === 'verbose';
  },

  get isQuiet(): boolean {
    return level === 'quiet';
  },

  /** Colors only for an interactive terminal, never with `NO_COLOR`. */
  get useColor(): boolean {
    if (process.env.NO_COLOR !== undefined && process.env.NO_COLOR !== '') {
      return false;
    }

    return process.env.FORCE_COLOR !== undefined
      ? process.env.FORCE_COLOR !== '0'
      : Boolean(process.stdout.isTTY);
  },

  /** Normal progress output (hidden by `--quiet`). */
  info(message: string): void {
    if (level !== 'quiet') {
      console.log(message);
    }
  },

  /** Extra detail (`--verbose`). */
  verbose(message: string): void {
    if (level === 'verbose') {
      console.log(message);
    }
  },

  warn(message: string): void {
    if (level !== 'quiet') {
      console.warn(message);
    }
  },

  /** Errors are always shown. */
  error(message: string, ...rest: unknown[]): void {
    console.error(message, ...rest);
  },

  /** Clickable file link (OSC 8), only in verbose output on a color terminal. */
  link(path: string): string {
    if (level !== 'verbose' || !logger.useColor) {
      return path;
    }

    return `\u001b]8;;file:///${path.replace(/\\/g, '/')}\u0007${path}\u001b]8;;\u0007`;
  },
};

/**
 * Resolves the level from CLI flags; the legacy `--no-debug` means quiet.
 */
export const resolveLogLevel = (flags: {
  quiet?: boolean;
  verbose?: boolean;
  debug?: boolean;
}): LogLevel => {
  if (flags.quiet || flags.debug === false) {
    return 'quiet';
  }

  return flags.verbose ? 'verbose' : 'normal';
};
