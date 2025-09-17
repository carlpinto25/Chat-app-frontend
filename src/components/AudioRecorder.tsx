import React, { useRef, useState } from 'react';

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
        setAudioUrl(URL.createObjectURL(recordedBlob));
        onRecordingComplete(recordedBlob);
        if (downloadOnSavePress) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(recordedBlob);
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


  return (
    <div>
      <audio controls src={audioUrl}/>
      <button onClick={startRecording} disabled={isRecording}><img src="./rec.png" alt="recorder" className="w-10 absolute top-205 mt-2 hover:scale-103"/></button>
      <button onClick={stopRecording} disabled={!isRecording} className="w-8 bg-gray-600 border-2 ml-15">.</button>
    </div>
  );
};

export default AudioRecorder;