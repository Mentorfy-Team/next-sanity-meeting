import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";

export const TranscriptionButton = () => {
  const { useCallCallingState, useIsCallRecordingInProgress, useIsCallTranscribingInProgress } =
		useCallStateHooks();
    const isTranscribing = useIsCallTranscribingInProgress();
  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    console.log("isTranscribing", isTranscribing);
  }, [isTranscribing]);

  const toggleTranscription = async () => {
    try {
      if (isTranscribing) {
        await call.stopTranscription();
      } else {
        await call.update({
          settings_override:{
            transcription: {
              mode: "available",
              languages: ["pt"]
            }
          }
        })
        await call.startTranscription();
      }
    } catch (error) {
      console.error("Erro ao gerenciar transcrição:", error);
    }
  };

  return (
    <button
      onClick={toggleTranscription}
      className={`control-button ${isTranscribing ? "bg-primary/75" : ""}`}
      style={{
        backgroundColor: isTranscribing ? "#dc433b" : "#19232d",
      }}
      title={isTranscribing ? "Parar Transcrição" : "Iniciar Transcrição"}
      type="button"
    >
      <FileText size={20} />
    </button>
  );
}; 