import { useCall } from "@stream-io/video-react-sdk";
import { FileText } from "lucide-react";
import { useState } from "react";

export const TranscriptionButton = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const call = useCall();

  if (!call) return null;

  const toggleTranscription = async () => {
    try {
      if (isTranscribing) {
        await call.stopTranscription();
        setIsTranscribing(false);
      } else {
        await call.startTranscription({
          
        });
        setIsTranscribing(true);
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