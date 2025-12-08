// src/message/MediaUpload.tsx
import { FiFilePlus, FiMic, FiMicOff } from "react-icons/fi";

type Props = {
  files: FileList | null;
  audioURL: string | null;
  recording: boolean;
  recordTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onFileChange: (files: FileList | null) => void;
};

export default function MediaUpload({
  files,
  audioURL,
  recording,
  recordTime,
  onStartRecording,
  onStopRecording,
  onFileChange,
}: Props) {
  const isRecordingSupported = typeof MediaRecorder !== "undefined";

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 text-sm font-semibold text-[#0a1f44] cursor-pointer"
        >
          <FiFilePlus className="text-lg" /> Attach Files
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={(e) => onFileChange(e.target.files)}
          className="text-sm text-gray-600 mt-1"
        />
        {files && files.length > 0 && (
          <ul className="mt-2 text-xs text-gray-700 list-disc list-inside">
            {Array.from(files).map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Voice Note */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[#0a1f44]">
          <FiMic /> Voice Note
        </label>

        {isRecordingSupported ? (
          <div className="flex flex-wrap gap-3 items-center mt-2">
            {!recording ? (
              <button
                type="button"
                onClick={onStartRecording}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md text-sm"
              >
                <FiMic /> Start
              </button>
            ) : (
              <button
                type="button"
                onClick={onStopRecording}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm"
              >
                <FiMicOff /> Stop
              </button>
            )}

            {recording && (
              <span className="text-xs text-red-600 font-bold animate-pulse">
                Recording... {recordTime}s
              </span>
            )}

            {audioURL && (
              <audio controls src={audioURL} className="mt-2 w-full rounded" />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs text-gray-600">
              Recording not supported on your device. Please upload a voice
              file:
            </p>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => onFileChange(e.target.files)}
              className="text-sm text-gray-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}
