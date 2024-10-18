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
import { LayoutList, Users, MessageSquare } from 'lucide-react';
import EndCallButton from './EndCallButton';
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "stream-chat-react/dist/css/v2/index.css";
import "./SpeakerView.scss"
import { useUserStore } from '@/hooks/userStore';
import { tokenProvider } from '@/actions/stream.action';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  const [showChat, setShowChat] = useState(true);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 700px)');

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const { name: userName, token, apiKey } = useUserStore();

  const chatClient = useCreateChatClient({
    apiKey: apiKey,
    userData: { id: call?.currentUserId || '', name: userName },
    tokenOrProvider: token,
  });

  const [activeChannel, setActiveChannel] = useState(null);

  useEffect(() => {
    if (!participantsBar || !call) return;

    const cleanup = call.dynascaleManager.setViewport(participantsBar);

    return () => cleanup();
  }, [participantsBar, call]);

  useEffect(() => {
    const initializeChannel = async () => {
      if (!chatClient || !call) return;

      const channelId = call.id;
      const existingChannels = await chatClient.queryChannels({ id: channelId });

      if (existingChannels.length === 0) {
        // Create a new channel if it doesn't exist
        const newChannel = chatClient.channel('messaging', channelId, {
          name: `Video Call Chat - ${channelId}`,
          members: [call.currentUserId || ''],
        });
        await newChannel.create();
        setActiveChannel(newChannel as any);
      } else {
        setActiveChannel(existingChannels[0] as any);
      }
    };

    initializeChannel();
  }, [chatClient, call]);

  if (callingState !== CallingState.JOINED) return <Loader />;

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

  const toggleParticipants = () => {
    setShowParticipants(prev => !prev);
    if (!showParticipants) {
      setShowChat(false);
    }
  };

  const toggleChat = () => {
    setShowChat(prev => !prev);
    if (!showChat) {
      setShowParticipants(false);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex w-[100dvw] h-[inherit] items-center justify-center">
        <div className={cn("flex size-full items-center justify-center ml-2", {
          "ml-0": !showChat && !showParticipants,
        })}>
          <CallLayout />
        </div>
        <div className={cn("sidebar-container min-w-[400px] ml-2", {
          "hidden min-w-0 ml-0": !showParticipants && !showChat,
          "mobile": isMobile,
        })}>
          {showParticipants && (
            <div className="h-full w-full">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          )}
          {showChat && chatClient && activeChannel && (
            <div className="h-full w-full">
              <Chat client={chatClient}>
                <Channel channel={activeChannel}>
                  <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageInput disabled={false} />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          )}
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
            <button onClick={toggleParticipants}>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <Users size={20} className="text-white" />
              </div>
            </button>
            <button onClick={toggleChat}>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <MessageSquare size={20} className="text-white" />
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
