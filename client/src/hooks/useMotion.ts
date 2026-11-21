import { useLayoutEffect, type DependencyList, type RefObject } from 'react'
import { gsap } from '../lib/gsap'

export type MotionEnv = { reduced: boolean; desktop: boolean; mobile: boolean }

/**
 * Scoped GSAP setup. Uses gsap.matchMedia so every tween / ScrollTrigger created in
 * `setup` is reverted automatically on unmount or when the breakpoint flips.
 * Selectors inside `setup` are scoped to `scope`.
 */
export function useMotion(
  scope: RefObject<Element | null>,
  setup: (env: MotionEnv) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scope.current ?? undefined)
    mm.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 1024px)',
        mobile: '(max-width: 1023px)',
      },
      (ctx) => {
        const c = ctx.conditions as Record<string, boolean>
        return setup({ reduced: !!c.reduced, desktop: !!c.desktop, mobile: !!c.mobile })
      },
    )
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
