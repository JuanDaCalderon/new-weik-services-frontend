import {useState, useEffect} from 'react';
import {BREAKPOINTS, BREAKPOINTS_VALUES} from '@/constants';

const getBreakpoint = (width: number): BREAKPOINTS => {
  if (width >= BREAKPOINTS_VALUES.xxl) return BREAKPOINTS.xxl;
  if (width >= BREAKPOINTS_VALUES.xl) return BREAKPOINTS.xl;
  if (width >= BREAKPOINTS_VALUES.lg) return BREAKPOINTS.lg;
  if (width >= BREAKPOINTS_VALUES.md) return BREAKPOINTS.md;
  if (width >= BREAKPOINTS_VALUES.sm) return BREAKPOINTS.sm;
  return BREAKPOINTS.xs;
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<BREAKPOINTS>(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isXS: breakpoint === BREAKPOINTS.xs,
    isSM: breakpoint === BREAKPOINTS.sm,
    isMD: breakpoint === BREAKPOINTS.md,
    isLG: breakpoint === BREAKPOINTS.lg,
    isXL: breakpoint === BREAKPOINTS.xl,
    isXXL: breakpoint === BREAKPOINTS.xxl
  };
};

export default useBreakpoint;
