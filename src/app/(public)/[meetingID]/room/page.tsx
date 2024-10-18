'use client';
import React, { useEffect, useState } from 'react';
import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { Lobby } from '@/components/VideoCall/Lobby';
import { MeetingRoom } from '@/components/VideoCall/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/VideoCall/MeetingSetup';
import Loader from '@/components/VideoCall/Loader';
import { useUserStore } from '@/hooks/userStore';

export default function VideoCallPage({ params: { meetingID } }: { params: { meetingID: string } }) {
  const { call, isCallLoading } = useGetCallById(meetingID);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { id: userId } = useUserStore();
  
  if (!userId || isCallLoading) return <Loader />;

  return (
      <StreamCall call={call}>
        {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
      </StreamCall>
  );
}

