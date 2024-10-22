'use client';
import React, { useState } from 'react';
import {
  StreamCall,
} from '@stream-io/video-react-sdk';
import { MeetingRoom } from '@/components/VideoCall/MeetingRoom';
import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/components/VideoCall/MeetingSetup';
import Loader from '@/components/VideoCall/Loader';
import { useUserStore } from '@/hooks/userStore';

export default function VideoCallPage({ params: { meetingID } }: { params: { meetingID: string } }) {
  const { call, isCallLoading } = useGetCallById(meetingID);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { name: userName, token, apiKey, meetingId, isModerator, id: userId } = useUserStore();
  
  if (!userId || !userName || !token || !apiKey || !meetingId || isCallLoading) return <Loader />;

  return (
      <StreamCall call={call}>
        {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom name={userName} token={token} apiKey={apiKey} meetingId={meetingId} isModerator={isModerator} id={userId} />
          )}
      </StreamCall>
  );
}

