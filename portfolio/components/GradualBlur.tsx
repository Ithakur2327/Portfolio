'use client';

import { useMemo, type CSSProperties } from 'react';

export interface GradualBlurProps {
  height?: string | number;
  strength?: number;
  layers?: number;
  zIndex?: number;
}

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const toLength = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

const GradualBlur = ({
  height = 64,
  strength = 1.5,
  layers = 4,
  zIndex = 40
}: GradualBlurProps) => {
  const stack = useMemo(() => {
    const count = Math.min(Math.max(Math.round(layers) || 1, 1), 16);
    const maxBlur = Math.max(strength, 0) * 12;
    const level = (u: number) => maxBlur * (Math.pow(2, 4 * clamp01(u)) - 1) / 15;
    const steps: CSSProperties[] = [];
    for (let i = 0; i < count; i++) {
      const from = level(i / count);
      const to = level((i + 1) / count);
      const radius = Math.sqrt(Math.max(to * to - from * from, 0));
      const mask = `linear-gradient(to bottom, transparent ${((i / count) * 100).toFixed(2)}%, #000 ${(((i + 1) / count) * 100).toFixed(2)}%)`;
      steps.push({
        position: 'absolute',
        inset: 0,
        backdropFilter: `blur(${radius.toFixed(3)}px)`,
        WebkitBackdropFilter: `blur(${radius.toFixed(3)}px)`,
        maskImage: mask,
        WebkitMaskImage: mask
      });
    }
    return steps;
  }, [layers, strength]);

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
    <div style={rootStyle} aria-hidden="true">
      {stack.map((layer, index) => (
        <div key={index} style={layer} />
      ))}
    </div>
  );
};

export default GradualBlur;
