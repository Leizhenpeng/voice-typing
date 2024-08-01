import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AutoSizer } from 'react-virtualized';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function MicFFT({ fft, className }: { fft: number[]; className?: string }) {
  return (
    <div className={'relative size-full'}>
      <AutoSizer>
        {({ width, height }) => (
          <motion.svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className={cn('absolute !inset-0 !size-full', className)}>
            {Array.from({ length: 24 }).map((_, index) => {
              const value = (fft[index] ?? 0) / 4;
              const h = Math.min(Math.max(height * value, 2), height);
              const yOffset = height * 0.5 - h * 0.5;

              return (
                <motion.rect
                  key={`mic-fft-${index}`}
                  height={h}
                  width={2}
                  x={2 + (index * width - 4) / 24}
                  y={yOffset}
                  rx={4}
                />
              );
            })}
          </motion.svg>
        )}
      </AutoSizer>
    </div>
  );
}

function VoiceApp() {
  const [isRecording, setIsRecording] = useState(false);
  const [fftData, setFftData] = useState(new Array(24).fill(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(new Uint8Array(24));

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // You can try changing this value to 128 or 256
      source.connect(analyserRef.current);
      setIsRecording(true);
      requestAnimationFrame(updateFftData);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsRecording(false);
  };

  const updateFftData = () => {
    if (isRecording && analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      setFftData(Array.from(dataArrayRef.current));
      requestAnimationFrame(updateFftData);
      console.log('FFT Data updated', dataArrayRef.current); // Log to check if data is being updated
    }
  };

  return (
    <div className="flex items-center min-w-[80px]">
      <button onClick={isRecording ? stopRecording : startRecording}>{isRecording ? '暂停' : '开始'}</button>
      <MicFFT fft={fftData} className={'fill-current'} />
    </div>
  );
}

export default VoiceApp;
