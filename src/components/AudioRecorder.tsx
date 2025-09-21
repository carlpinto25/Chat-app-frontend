import React, { useRef, useState, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  audioTrackConstraints?: MediaTrackConstraints;
  downloadOnSavePress?: boolean;
  downloadFileExtension?: 'webm' | 'mp3' | 'wav';
  onNotAllowedOrFound?: (error: DOMException) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  audioTrackConstraints,
  downloadOnSavePress,
  downloadFileExtension = 'webm',
  onNotAllowedOrFound
}) => {
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: number;
    if (isRecording) {
      setElapsed(0);
      timer = window.setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioTrackConstraints || true,
      });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);
        onRecordingComplete(recordedBlob);
        if (downloadOnSavePress) {
          const link = document.createElement('a');
          link.href = url;
          link.download = `recording.${downloadFileExtension}`;
          link.click();
        }
        chunks.current = [];
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      if (onNotAllowedOrFound && error instanceof DOMException) {
        onNotAllowedOrFound(error);
      } else {
        console.error('Recording error:', error);
      }
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="w-1/16">
      {/* Only show audio player if there's a recording URL */}
      {audioUrl && (
        <audio controls src={audioUrl} className="w-60 -mt-20" />
      )}

      {/* Record button */}
      <button onClick={startRecording} disabled={isRecording}>
        <img
          src="./rec.png"
          alt="recorder"
          className="w-10 mt-10 hover:scale-103"
        />
      </button>

      {/* Timer and Stop button visible only while recording */}
      {isRecording && (
        <div className="flex items-center space-x-4 mt-2">
          <span className="text-red-500 font-bold">{formatTime(elapsed)}</span>
          <button
            onClick={stopRecording}
            className="w-8 bg-gray-600 border-2 ml-2 text-white"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
