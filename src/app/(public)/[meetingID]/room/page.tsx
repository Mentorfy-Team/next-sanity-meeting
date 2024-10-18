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
  // const { meetingID } = params;
  // const [client, setClient] = useState<StreamVideoClient | null>(null);
  // const [call, setCall] = useState<Call | undefined>(undefined);
  // const [room, setRoom] = useState<any>(null);
  // const [config, setConfig] = useState<{
  //   apiKey: string;
  //   token: string;
  //   userId: string;
  // } | null>(null);

  // const handleJoinCall = async (name: string) => {
  //   const user_id = Math.floor(Math.random() * 1000000).toString();
  //   const response = await fetch(`/api/create-token?user_id=${user_id}`);
  //   const { token, apiKey } = await response.json();
  //   setConfig({ apiKey, token, userId: user_id });
  //   const client = new StreamVideoClient({ apiKey, user: { id: user_id, name: name }, token });
  //   const call = client.call('default', meetingID);
  //   // call.updateUserPermissions({
  //   //   user_id: user_id,
  //   //   grant_permissions: ['admin'],
  //   // });
  //   call.join({ create: true });
  //   setClient(client);
  //   setCall(call);
  // };

  // const handleInit = async () => {
  //   const response = await fetch(`/api/room/${meetingID}`);
  //   const data = await response.json();
  //   setRoom(data);
  // };

  // useEffect(() => {
  //   handleInit();
  // }, []);

  // const handleEndCall = () => {
  //   setCall(undefined);
  //   setClient(null);
  //   window.location.reload();
  // };

  // if (!client || !call || !config) {
  //   return <Lobby onJoinCall={handleJoinCall} room={room} />;
  // }
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

