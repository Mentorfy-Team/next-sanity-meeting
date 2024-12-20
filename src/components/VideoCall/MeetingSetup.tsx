"use client";

import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { VideoEffectsButton } from "./MeetingRoom";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();

  if (!call) {
    throw new Error("useCall must be used within StreamCall component");
  }

  useEffect(() => {
    isMicEnabled ? call.microphone.enable() : call.microphone.disable();
  }, [isMicEnabled, call.microphone]);

  useEffect(() => {
    isCameraEnabled ? call.camera.enable() : call.camera.disable();
  }, [isCameraEnabled, call.camera]);

  const toggleMic = () => setIsMicEnabled(prev => !prev);
  const toggleCamera = () => setIsCameraEnabled(prev => !prev);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Pré-visualização</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <button
          className={`w-9 h-9 rounded-full items-center justify-center hover:bg-[#323b44] flex ${
            isMicEnabled ? 'bg-green-500' : 'bg-red-500'
          }`}
          type="button"
          title={isMicEnabled ? "Desativar Microfone" : "Ativar Microfone"}
          onClick={toggleMic}
        >
          {isMicEnabled ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          className={`w-9 h-9 rounded-full items-center justify-center hover:bg-[#323b44] flex ${
            isCameraEnabled ? 'bg-green-500' : 'bg-red-500'
          }`}
          type="button"
          title={isCameraEnabled ? "Desativar Câmera" : "Ativar Câmera"}
          onClick={toggleCamera}
        >
          {isCameraEnabled ? <Camera size={18} /> : <CameraOff size={18} />}
        </button>
        <VideoEffectsButton />
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        disabled={isJoining}
        onClick={async () => {
          try {
            setIsJoining(true);
            await call.getOrCreate({
              data: {
                settings_override: {
                  transcription: {
                    mode: "available",
                    languages: ["pt"],
                    closed_caption_mode: "available",
                  },
                },
              },
            });
            call.join();
            setIsSetupComplete(true);
          } catch (error) {
            console.error('Erro ao entrar na chamada:', error);
          } finally {
            setIsJoining(false);
          }
        }}
      >
        {isJoining ? "Entrando..." : "Entrar na chamada"}
      </Button>
    </div>
  );
};

export default MeetingSetup;
