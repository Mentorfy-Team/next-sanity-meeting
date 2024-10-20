import React, { useEffect, useState } from 'react';
import {
  CallingState,
  useCallStateHooks,
  useCall,
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallStatsButton,
  CallControlsProps,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ReactionsButton,
  RecordCallButton,
  ToggleVideoPublishingButton,
  CancelCallButton,
} from '@stream-io/video-react-sdk';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  useCreateChatClient,
  ChannelStateContext,
  useChannelStateContext,
} from 'stream-chat-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from './Loader';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { LayoutList, Users, MessageSquare, MoreHorizontal } from 'lucide-react';
import EndCallButton from './EndCallButton';
import "@stream-io/video-react-sdk/dist/css/styles.css"
import "stream-chat-react/dist/css/v2/index.css";
import "./SpeakerView.scss"
import { useUserStore } from '@/hooks/userStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useCreateStreamChatClient } from '@/hooks/useChatClient';
import { ChatUI } from '../organisms/ChatUI';

interface MeetingRoomProps {
  name: string;
  token: string;
  apiKey: string;
  meetingId: string;
  isModerator: boolean;
  id: string;
}
type CallLayoutType = "grid" | "speaker-left" | "speaker-right" | "speaker-top" | "speaker-bottom";

export const MeetingRoom: React.FC<MeetingRoomProps> = ({ name: userName, token, apiKey, meetingId, isModerator, id: userId }) => {
  const [layout, setLayout] = useState<CallLayoutType>("grid");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 700px)');
  
  const { useCallCallingState, useCallSettings } = useCallStateHooks();
  const callingState = useCallCallingState();
  const settings = useCallSettings();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout pageArrowsVisible participantsBarLimit="dynamic" participantsBarPosition="left" />;
      case "speaker-bottom":
        return <SpeakerLayout pageArrowsVisible participantsBarLimit="dynamic" participantsBarPosition="top" />;
      case "speaker-top":
        return <SpeakerLayout pageArrowsVisible participantsBarLimit="dynamic" participantsBarPosition="bottom" />;
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
    <section className="relative h-screen w-full overflow-hidden text-white">
      <div className="relative flex w-[100dvw] h-[inherit] items-center justify-center">
        <div className={cn("flex size-full items-center justify-center ml-2", {
          "ml-0": !showChat && !showParticipants,
        })}>
          <CallLayout />
        </div>
        {!(!showChat && !showParticipants) && <div className={cn("sidebar-container mr-2 min-w-[400px] ml-2", {
          "hidden min-w-0 ml-0 mr-0": !showChat && !showParticipants,
          "mobile": isMobile,
        })}>
          {showParticipants && (
            <div className="h-full w-full">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
          )}
          {showChat && (
            <div className="h-full w-full">
              <ChatUI meetingId={meetingId} 
                disabledSend={false} 
              />
            </div>
          )}
        </div>}
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-2">
        <div className="control_wrapper flex w-full justify-center items-center">
          {!isModerator && (<button onClick={toggleChat}>
              <div className="cursor-pointer mr-4 rounded-full bg-[#19232d] px-2 py-2 hover:bg-[#4c535b]">
                <MessageSquare size={20} className="text-white" />
              </div>
            </button>)}
          <CallControls isModerator={isModerator} onLeave={() => router.push("/")} />
          {isModerator && <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] ml-2">
              <MoreHorizontal size={20} className="text-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
              {isModerator && (
                <>
                  <DropdownMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full text-left">
                        <LayoutList size={20} className="inline-block mr-2" />
                        Layout
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
                        {["Grid", "Speaker-Left", "Speaker-Right", "Speaker-Top", "Speaker-Bottom"].map((item, index) => (
                          <DropdownMenuItem
                            key={index}
                            className="cursor-pointer"
                            onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                          >
                            {item}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={toggleParticipants}>
                <Users size={20} className="inline-block mr-2" />
                Participantes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleChat}>
                <MessageSquare size={20} className="inline-block mr-2" />
                Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <EndCallButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
          {isModerator && <div className="ml-2">
            <CallStatsButton />
          </div>}
        </div>
      </div>
    </section>
  );
};

const CallControls = ({ onLeave, isModerator }: CallControlsProps & { isModerator: boolean }) => (
  <div className="str-video__call-controls">
    <ReactionsButton />
    <SpeakingWhileMutedNotification>
      <ToggleAudioPublishingButton />
    </SpeakingWhileMutedNotification>
    {isModerator && <RecordCallButton />}
    <ToggleVideoPublishingButton />
    <CancelCallButton onLeave={onLeave} />
  </div>
);