"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

interface AudioRecorderProps {
  onRecorded: (blob: Blob | null) => void;
}

export function AudioRecorder({ onRecorded }: AudioRecorderProps) {
  const { t } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        onRecorded(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError(t.incident.micError);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  function clearRecording() {
    setAudioUrl(null);
    onRecorded(null);
  }

  return (
    <div className="space-y-2">
      {!recording && (
        <button
          type="button"
          onClick={startRecording}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          🎙 {t.incident.record}
        </button>
      )}
      {recording && (
        <button
          type="button"
          onClick={stopRecording}
          className="animate-pulse rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white"
        >
          ⏹ {t.incident.stop} — {t.incident.recording}
        </button>
      )}
      {audioUrl && (
        <div className="flex items-center gap-2">
          <audio controls src={audioUrl} className="h-8" />
          <button type="button" onClick={clearRecording} className="text-xs text-gray-500 underline">
            {t.common.delete}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
