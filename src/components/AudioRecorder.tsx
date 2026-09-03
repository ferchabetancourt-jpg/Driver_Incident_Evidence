"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";

interface AudioRecorderProps {
  onRecorded: (blob: Blob | null) => void;
  label?: string;
}

const CANDIDATE_MIME_TYPES = [
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) {
    return undefined;
  }
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

export function AudioRecorder({ onRecorded, label }: AudioRecorderProps) {
  const { t } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    setError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(t.incident.micUnsupported);
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setError(t.incident.micUnsupported);
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError(t.incident.micDenied);
      } else if (name === "NotFoundError") {
        setError(t.incident.micNotFound);
      } else {
        setError(t.incident.micError);
      }
      return;
    }

    try {
      const mimeType = pickSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onerror = () => {
        setError(t.incident.micError);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        onRecorded(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError(t.incident.micError);
      stream.getTracks().forEach((track) => track.stop());
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
          className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          🎙 {label ?? t.incident.record}
        </button>
      )}
      {recording && (
        <button
          type="button"
          onClick={stopRecording}
          className="animate-pulse rounded-md bg-navy px-4 py-2 text-sm font-medium text-white"
        >
          ⏹ {t.incident.stop} — {t.incident.recording}
        </button>
      )}
      {audioUrl && (
        <div className="flex items-center gap-2">
          <audio controls src={audioUrl} className="h-8" />
          <button type="button" onClick={clearRecording} className="text-xs text-slate underline">
            {t.common.delete}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
