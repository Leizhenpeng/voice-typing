import React, { useState, useEffect, useRef } from 'react';
import MicFFT from './components/MicFFT';
import { throttle } from 'lodash-es';
import axios from 'axios';

const AudioRecorder = ({
  onFinalTranscript,
  useApiTranscription,
}: {
  onFinalTranscript: (text: string) => void;
  useApiTranscription: boolean;
}) => {
  const [recording, setRecording] = useState(false);
  const [fftData, setFftData] = useState(new Array(24).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const bufferLengthRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<webkitSpeechRecognition | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (recording) {
      startVisualizer();
      if (useApiTranscription) {
        monitorVolume();
      } else {
        startSpeechRecognition();
      }
    } else {
      stopVisualizer();
      stopSpeechRecognition();
    }
  }, [recording, useApiTranscription]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 64;
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    bufferLengthRef.current = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLengthRef.current);

    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
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

  const sendAudioToApi = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'openai.webm');
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post('https://api.openai-next.com/v1/audio/transcriptions', formData, {
        headers: {
          Authorization: 'Bearer sk-LBs25iYvnWaiktU0AdEe23601dB5419fA7Ed9439F9Eb53Bf',
          'Content-Type': 'multipart/form-data',
        },
      });

      onFinalTranscript(response.data.text);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  const monitorVolume = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    analyser.fftSize = 2048;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const processVolume = throttle(async () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }
      const volume = Math.sqrt(sum / bufferLength);

      if (volume < 0.02) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(async () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.requestData();
              const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              console.log('Audio blob:', audioBlob);
              audioChunksRef.current = [];
              await sendAudioToApi(audioBlob);
            }
            silenceTimeoutRef.current = null;
          }, 1500);
        }
      } else {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }

      if (recording) {
        requestAnimationFrame(processVolume);
      }
    }, 100);

    processVolume();
  };

  // 条形图
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

  // Chrome Speech Recognition API
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
        recognitionRef.current.start();
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
