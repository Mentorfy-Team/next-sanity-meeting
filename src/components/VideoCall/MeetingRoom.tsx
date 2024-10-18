import React, { useEffect, useState } from 'react';
import {
  CallControls,
  CallingState,
  StreamTheme,
  useCallStateHooks,
  ParticipantView,
  useCall,
  hasScreenShare,
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallStatsButton,
} from '@stream-io/video-react-sdk';
import { getCustomSortingPreset } from '@/utils/videoCallUtils';
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
} from 'stream-chat-react';
import { ChatWrapper } from './ChatWrapper';
import { ChatUI } from './ChatUI';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LayoutList, Users } from 'lucide-react';
import EndCallButton from './EndCallButton';
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "./SpeakerView.scss"

interface MeetingRoomProps {
}
type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export const MeetingRoom: React.FC<MeetingRoomProps> = () => {
  const [participantsBar, setParticipantsBar] = useState<HTMLDivElement | null>(
    null,
  );
  
  const searchParams = useSearchParams();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const router = useRouter();

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();

  useEffect(() => {
    if (!participantsBar || !call) return;

    const cleanup = call.dynascaleManager.setViewport(participantsBar);

    return () => cleanup();
  }, [participantsBar, call]);

  if (callingState !== CallingState.JOINED) return <Loader />;

  // const channel = chatClient.channel('messaging', {
  //   name: 'Chat',
  //   members: [userId],
  // });

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout pageArrowsVisible participantsBarLimit="dynamic" participantsBarPosition="left" />;
      default:
        return <SpeakerLayout pageArrowsVisible participantsBarLimit="dynamic" participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center place-content-center">
          <CallLayout />
          {/* <ChatWrapper chatClient={chatClient}>
            <div className="str-video__chat">
              <ChatUI
                onClose={() => {
                }}
                channelId={call?.id!}
              />
            </div>
          </ChatWrapper> */}
        </div>
        <div
          className={cn(" h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-2 flex-wrap">
        <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-2">
            <DropdownMenu>
              <div className="flex items-center">
                <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                  <LayoutList size={20} className="text-white" />
                </DropdownMenuTrigger>
              </div>

              <DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
                {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
                  <div key={index}>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        setLayout(item.toLowerCase() as CallLayoutType)
                      }
                    >
                      {item}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="border-dark-1" />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <CallStatsButton />
            <button onClick={() => setShowParticipants((prev) => !prev)}>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <Users size={20} className="text-white" />
              </div>
            </button>
            <EndCallButton />
          </div>
          <CallControls onLeave={() => router.push("/")} />
        </div>
      </div>
    </section>
  );
};
