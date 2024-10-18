"use client";

import Loader from "@/components/VideoCall/Loader";
import { useUserStore } from "@/hooks/userStore";
import { StreamVideoClient, StreamVideo, StreamTheme } from "@stream-io/video-react-sdk";
import { ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "@/actions/stream.action";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { id: userId, name: userName, setToken, setApiKey } = useUserStore();

  useEffect(() => {
    const init = async () => {
      if (!userName || !userId) return;
      if (!apiKey) throw new Error("Stream API key is missing");
      const token = await tokenProvider(userId);

      const client = new StreamVideoClient({
        apiKey,
        user: {
          id: userId,
          name: userName,
        },
        token: token,
      });

      setVideoClient(client);
      setToken(token);
      setApiKey(apiKey);
    };

    init();
  }, [userName, userId]);

  const translationsOverrides = {
    'pt-BR': {
      // Adicione aqui suas traduções personalizadas em português do Brasil
      'Call ended': 'Chamada encerrada',
      'Joining call': 'Entrando na chamada',
      Setup: 'Configuração',
      'Select a Camera': 'Selecione uma câmera',
      'Select a Mic': 'Selecione um microfone',
      'Select Speakers': 'Selecione os alto-falantes',
      Mic: 'Microfone',
      Camera: 'Câmera',
      Reactions: 'Reações',
      Record: 'Gravar',
      'Me': 'Eu',
      'Pin': 'Fixar',
      'Pin for everyone': 'Fixar para todos',
      'Unpin for everyone': 'Desafixar para todos',
      'Block': 'Bloquear',
      'Turn off video': 'Desligar vídeo',
      'Mute audio': 'Silenciar áudio',
      'Allow audio': 'Permitir áudio',
      'Allow video': 'Permitir vídeo',
      'Allow screen sharing': 'Permitir compartilhamento de tela',
      'Disable audio': 'Desativar áudio',
      'Disable video': 'Desativar vídeo',
      'Disable screen sharing': 'Desativar compartilhamento de tela',
      Search: 'Buscar',
      Participants: 'Participantes',
      'Camera on': 'Câmera ligada',
      'Camera off': 'Câmera desligada',
      'Mic on': 'Microfone ligado',
      'Mic off': 'Microfone desligado',
      'Speakers on': 'Alto-falantes ligados',
      'Speakers off': 'Alto-falantes desligados',
      'Screen sharing on': 'Compartilhamento de tela ligado',
      'Screen sharing off': 'Compartilhamento de tela desligado',
      'Screen sharing': 'Compartilhamento de tela',
    },
  };

  if (!videoClient) return <Loader />;
  return (
    <StreamTheme>
      <StreamVideo 
        translationsOverrides={translationsOverrides} 
        language="pt-BR" 
        client={videoClient}
      >
        {children}
      </StreamVideo>
    </StreamTheme>
  );
};

export default StreamVideoProvider;
