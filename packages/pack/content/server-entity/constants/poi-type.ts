  /**
   * The type of point of interest to look for
   */
  export type PoiType = 'bed' | 'jobsite' | 'meeting_area';

  export const POI_TYPE: PoiType[] = ['bed', 'jobsite', 'meeting_area'] as const;