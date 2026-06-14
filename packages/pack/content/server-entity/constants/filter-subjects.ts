/**
 * Filter subject types
 */
export type FilterSubject = 'self' | 'other' | 'parent' | 'baby' | 'target' | 'block' | 'damager';

/**
 * Available filter subjects
 */
export const FILTER_SUBJECTS: FilterSubject[] = ['self', 'other', 'parent', 'baby', 'target', 'block', 'damager'];
