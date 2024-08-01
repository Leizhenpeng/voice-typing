import React, { useState, useEffect, useRef } from 'react';
import MicFFT from './components/MicFFT';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [fftData, setFftData] = useState(new Array(24).fill(0));
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);

  useEffect(() => {
    if (recording) {
      console.log('Starting visualizer');
      startVisualizer();
    } else {
      console.log('Stopping visualizer');
      stopVisualizer();
    }
  }, [recording]);
  const startRecording = async () => {
    try {
      console.log('Requesting audio stream');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // 设置FFT大小
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      bufferLengthRef.current = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        console.log('Data available:', event.data);
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
        console.log('Recording stopped and audio URL set');
      };
      mediaRecorderRef.current.start();
      setRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      console.log('Recording stopped');
    } else {
      console.error('MediaRecorder is not initialized.');
    }
  };

  const startVisualizer = () => {
    const draw = () => {
      if (!recording) return;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const fftDataArray = Array.from(dataArrayRef.current).slice(0, 24);
        console.log('FFT Data:', fftDataArray); // Display FFT data in console
        setFftData(fftDataArray);
        requestAnimationFrame(draw);
      } else {
        console.error('Analyser node is not initialized.');
      }
    };
    draw();
  };

  const stopVisualizer = () => {
    setFftData(new Array(24).fill(0));
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded shadow-lg">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded ${recording ? 'bg-red-500' : 'bg-green-500'} text-white`}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div className="h-[48px] w-full mt-4">
        <MicFFT fft={fftData} />
      </div>
      {audioUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recorded Audio:</h3>
          <audio controls src={audioUrl} className="mt-2"></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
