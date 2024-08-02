import React, { useState, useEffect, useRef } from 'react';
import MicFFT from './components/MicFFT';

const AudioRecorder = ({ onFinalTranscript }: { onFinalTranscript: () => void }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [fftData, setFftData] = useState(new Array(24).fill(0));
  const audioContextRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const bufferLengthRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (recording) {
      startVisualizer();
      startSpeechRecognition();
    } else {
      stopVisualizer();
      stopSpeechRecognition();
    }
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      bufferLengthRef.current = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      stopVisualizer();
    }
  };

  const startVisualizer = () => {
    const draw = () => {
      if (!recording) return;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const normalizedData = Array.from(dataArrayRef.current)
          .slice(0, 24)
          .map(value => value / 256);
        setFftData(normalizedData);
        requestAnimationFrame(draw);
      }
    };
    draw();
  };

  const stopVisualizer = () => {
    setFftData(new Array(24).fill(0));
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API is not supported by this browser.');
      return;
    }

    recognitionRef.current = new webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'zh-CN';

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started.');
    };

    recognitionRef.current.onerror = event => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended.');
      if (recording) {
        recognitionRef.current.start(); // 重新启动语音识别
      }
    };

    recognitionRef.current.onresult = event => {
      let final_transcript = '';
      let interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      console.log('Final transcript:', final_transcript);
      console.log('Interim transcript:', interim_transcript);
      onFinalTranscript(interim_transcript);
    };

    recognitionRef.current.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-2 py-1 rounded ${recording ? 'bg-red-500' : 'bg-green-500'} text-white mr-2`}>
        {recording ? 'Stop' : 'Start'}
      </button>
      <div className="w-36 h-12">
        <MicFFT fft={fftData} className="fill-current text-blue-500" />
      </div>
    </div>
  );
};

export default AudioRecorder;
