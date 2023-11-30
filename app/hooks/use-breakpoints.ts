import { useMediaQuery } from 'react-responsive';

export enum Breakpoint {
    sm,
    md,
    lg,
    xl,
    twoxl
}

export function useBreakpoints(): Breakpoint {
    const isSm = useMediaQuery({ query: `(min-width: 640px)` });
    const isMd = useMediaQuery({ query: `(min-width: 768px)` });
    const isLg = useMediaQuery({ query: `(min-width: 1024px)` });
    const isXl = useMediaQuery({ query: `(min-width: 1280px)` });
    const isTwoxl = useMediaQuery({ query: `(min-width: 1536px)` });

    console.log(isSm, isMd, isLg, isXl, isTwoxl);

    if (isTwoxl) return Breakpoint.twoxl;
    if (isXl) return Breakpoint.xl;
    if (isLg) return Breakpoint.lg;
    if (isMd) return Breakpoint.md;
    return Breakpoint.sm;
}