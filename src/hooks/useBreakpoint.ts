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
  const [breakpoint, setBreakpoint] = useState<BREAKPOINTS>(() =>
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : BREAKPOINTS.xs
  );

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isHugeScreen = breakpoint === BREAKPOINTS.xxl;
  const isDesktop = [BREAKPOINTS.xxl, BREAKPOINTS.xl, BREAKPOINTS.lg].includes(breakpoint);
  const isTablet = [BREAKPOINTS.lg, BREAKPOINTS.md].includes(breakpoint);
  const isMobile = [BREAKPOINTS.sm, BREAKPOINTS.xs].includes(breakpoint);

  return {
    breakpoint,
    isXS: breakpoint === BREAKPOINTS.xs,
    isSM: breakpoint === BREAKPOINTS.sm,
    isMD: breakpoint === BREAKPOINTS.md,
    isLG: breakpoint === BREAKPOINTS.lg,
    isXL: breakpoint === BREAKPOINTS.xl,
    isXXL: breakpoint === BREAKPOINTS.xxl,
    isHugeScreen,
    isDesktop,
    isTablet,
    isMobile,
    isNotDesktop: !isDesktop,
    isNotTablet: !isTablet,
    isNotMobile: !isMobile
  };
};

export default useBreakpoint;
