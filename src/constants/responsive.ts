export enum BREAKPOINTS {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl'
}

export const BREAKPOINTS_VALUES: Record<BREAKPOINTS, number> = {
  [BREAKPOINTS.xs]: 0,
  [BREAKPOINTS.sm]: 576,
  [BREAKPOINTS.md]: 768,
  [BREAKPOINTS.lg]: 992,
  [BREAKPOINTS.xl]: 1200,
  [BREAKPOINTS.xxl]: 1400
};
