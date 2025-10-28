'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { HTMLAttributes } from 'react';

type MotionDivProps = MotionProps & HTMLAttributes<HTMLDivElement> & {
    tag?: keyof JSX.IntrinsicElements;
};

export function MotionDiv({ tag = 'div', children, ...props }: MotionDivProps) {
  const MotionComponent = motion[tag] as React.FC<any>;
  return <MotionComponent {...props}>{children}</MotionComponent>;
}
