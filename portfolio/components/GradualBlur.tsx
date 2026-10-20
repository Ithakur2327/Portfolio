'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react';

export interface GradualBlurProps {
  height?: string | number;
  strength?: number;
  layers?: number;
  autoHide?: boolean;
  zIndex?: number;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const toLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

const GradualBlur = ({
  height = 64,
  strength = 1.5,
  layers = 8,
  autoHide = false,
  zIndex = 40
}: GradualBlurProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const stack = useMemo(() => {
    const count = Math.min(Math.max(Math.round(layers) || 1, 1), 16);
    const maxBlur = Math.max(strength, 0) * 12;
    const level = (u: number) => maxBlur * (Math.pow(2, 4 * clamp01(u)) - 1) / 15;
    const steps: CSSProperties[] = [];
    for (let i = 0; i < count; i++) {
      const from = level(i / count);
      const to = level((i + 1) / count);
      const radius = Math.sqrt(Math.max(to * to - from * from, 0));
      const mask = `linear-gradient(to top, transparent ${((i / count) * 100).toFixed(2)}%, #000 ${(((i + 1) / count) * 100).toFixed(2)}%)`;
      steps.push({
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(calc(${radius.toFixed(3)}px * var(--gradual-blur-reveal, 1)))`,
        WebkitBackdropFilter: `blur(calc(${radius.toFixed(3)}px * var(--gradual-blur-reveal, 1)))`,
        maskImage: mask,
        WebkitMaskImage: mask,
        transition: 'backdrop-filter 0.3s ease-out, -webkit-backdrop-filter 0.3s ease-out'
      });
    }
    return steps;
  }, [layers, strength]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (!autoHide) {
      root.style.removeProperty('--gradual-blur-reveal');
      return undefined;
    }
    const update = () => {
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const box = root.getBoundingClientRect();
      const reach = Math.max(box.height, 1);
      const room = limit - window.scrollY;
      root.style.setProperty('--gradual-blur-reveal', clamp01(room / reach).toFixed(3));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [autoHide]);

  const rootStyle: CSSProperties = {
    position: 'fixed',
    zIndex,
    bottom: 0,
    left: 0,
    right: 0,
    height: toLength(height),
    pointerEvents: 'none'
  };

  return (
    <div ref={rootRef} style={rootStyle} aria-hidden="true">
      {stack.map((layer, index) => (
        <div key={index} style={layer} />
      ))}
    </div>
  );
};

export default GradualBlur;
