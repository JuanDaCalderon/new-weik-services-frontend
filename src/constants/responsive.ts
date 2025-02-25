export enum BREAKPOINTS {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl'
}

/**
 * RESPONSIVE BREAKPOINTS VALUES
 *
 * xs -> 0 Mobile
 *
 * sm -> 576 Mobile
 *
 * md -> 768 Tablet
 *
 * lg -> 992 Desktop y Tablet
 *
 * xl -> 1200 Desktop
 *
 * xxl -> 1400 Desktop
 *
 * @type {Record<BREAKPOINTS, number>}
 */
export const BREAKPOINTS_VALUES: Record<BREAKPOINTS, number> = {
  /** Smaller Mobile */
  [BREAKPOINTS.xs]: 0, // Mobile
  /** Normal Mobile */
  [BREAKPOINTS.sm]: 576, // Mobile
  /** Tablet */
  [BREAKPOINTS.md]: 768, // Tablet
  /** Small Desktop or Bigger Tablets */
  [BREAKPOINTS.lg]: 992, // Desktop y Tablet
  /* Desktop */
  [BREAKPOINTS.xl]: 1200, // Desktop
  /* Bigger Desktop */
  [BREAKPOINTS.xxl]: 1400 // Desktop
};
