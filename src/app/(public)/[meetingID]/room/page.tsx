'use client';
import React, { useState } from 'react';
import {
  BackgroundFiltersProvider,
  StreamCall,
} from '@stream-io/video-react-sdk';
import { MeetingRoom } from '@/components/VideoCall/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/VideoCall/MeetingSetup';
import Loader from '@/components/VideoCall/Loader';
import { useUserStore } from '@/hooks/userStore';

const getHost = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

export default function VideoCallPage({ params: { meetingID } }: { params: { meetingID: string } }) {
  const { call, isCallLoading } = useGetCallById(meetingID);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { name: userName, token, apiKey, meetingId, isModerator, id: userId } = useUserStore();
  const host = getHost();

  const backgroundImages = [
    '/images/bg/image(1).jpg',
    '/images/bg/image(2).jpg',
    '/images/bg/image(3).jpg',
    '/images/bg/image(4).jpg',
    '/images/bg/image(5).jpg',
    '/images/bg/image(6).jpg',
    '/images/bg/image(7).jpg',
    '/images/bg/image(8).jpg',
    '/images/bg/image(9).jpg',
    '/images/bg/image(10).jpg',
    '/images/bg/image(11).jpg',
    '/images/bg/image(12).jpg',
    '/images/bg/image(13).jpg',
    '/images/bg/image(14).jpg',
  ].map(path => `${host}${path}`);

  if (!userId || !userName || !token || !apiKey || !meetingId || isCallLoading) return <Loader />;

  return (
      <StreamCall call={call}>
        <BackgroundFiltersProvider
          backgroundFilter={undefined}
          backgroundImages={backgroundImages}
          onError={(error) => {
            console.log('Erro no filtro de fundo:', error);
            // Aqui você pode adicionar lógica adicional, como desativar a câmera ou mostrar uma notificação
          }}
          
        >
        {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom name={userName} token={token} apiKey={apiKey} meetingId={meetingId} isModerator={isModerator} id={userId} />
          )}
        </BackgroundFiltersProvider>
      </StreamCall>
  );
}

