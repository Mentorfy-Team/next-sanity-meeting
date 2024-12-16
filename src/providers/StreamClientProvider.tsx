"use client";

import Loader from "@/components/VideoCall/Loader";
import { useUserStore } from "@/hooks/userStore";
import { StreamVideoClient, StreamVideo, StreamTheme, BackgroundFiltersProvider } from "@stream-io/video-react-sdk";
import { type ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "@/actions/stream.action";
import { useRouter } from "next/navigation";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children, params: { meetingID } }: { children: ReactNode, params: { meetingID: string } }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { id: userId, name: userName, setToken, setApiKey, isModerator } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    if (!userName || !userId) {
      router.push(`/${meetingID}`);
    } else if (!meetingID) {
      router.push('/');
    }
  }, [userName, userId, meetingID, router]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const init = async () => {
      if (!userName || !userId) return;
      if (!apiKey) throw new Error("Stream API key is missing");
      const token = await tokenProvider(userId, isModerator);

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
      'Record call': 'Gravar chamada',
      'Leave call': 'Sair da chamada',
      'Statistics': 'Estatísticas',
      'Call Latency': 'Latência da chamada',
      'Very high latency values may reduce call quality, cause lag, and make the call less enjoyable.': 'Valores de latência muito altos podem reduzir a qualidade da chamada, causar atrasos e tornar a chamada menos agradável.',
      'Call performance': 'Desempenho da chamada',
      'Review the key data points below to assess call performance': 'Revise os pontos de dados principais abaixo para avaliar o desempenho da chamada',
      'Region': 'Região',
      'Latency': 'Latência',
      'Receive jitter': 'Jitter de recebimento',
      'Publish jitter': 'Jitter de publicação',
      'Good': 'Bom',
      'Poor': 'Ruim',
      'Average': 'Médio',
      'High': 'Alto',
      'Low': 'Baixo',
      'Publish resolution': 'Resolução de publicação',
      'Publish quality drop reason': 'Motivo da queda de qualidade na publicação',
      'none': 'nenhum',
      'Receiving resolution': 'Resolução de recebimento',
      'Receive quality drop reason': 'Motivo da queda de qualidade no recebimento',
      'Publish bitrate': 'Taxa de bits de publicação',
      'Receiving bitrate': 'Taxa de bits de recebimento',
      '{{ direction }} fullscreen': 'Tela cheia',
      '{{ direction }} picture-in-picture': 'picture-in-picture',
      'Turn off screen share': 'Desativar compartilhamento de tela',
      'Share screen': 'Compartilhar tela',
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
