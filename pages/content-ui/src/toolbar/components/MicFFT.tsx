'use client';

import { cn } from './cn';
import { motion } from 'framer-motion';
import { AutoSizer } from 'react-virtualized';

export default function MicFFT({ fft, className }: { fft: number[]; className?: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AutoSizer>
        {({ width, height }) => {
          // 设定条形图的最大高度
          const maxBarHeight = 28;

          return (
            <motion.svg
              viewBox={`0 0 ${width} ${height}`}
              width={width}
              height={height}
              className={cn('absolute inset-0', className)}>
              {fft.map((value, index) => {
                // 计算条形图的高度，并应用最大高度限制
                const h = Math.min(Math.max(height * value, 2), maxBarHeight);
                const yOffset = height * 0.5 - h * 0.5;
                const barWidth = 4; // 增加条形图的宽度
                const barSpacing = 2; // 缩小条形之间的距离

                return (
                  <motion.rect
                    key={`mic-fft-${index}`}
                    height={h}
                    width={barWidth}
                    x={index * (barWidth + barSpacing)}
                    y={yOffset}
                    rx={2}
                    className="text-blue-500 fill-current"
                  />
                );
              })}
            </motion.svg>
          );
        }}
      </AutoSizer>
    </div>
  );
}
