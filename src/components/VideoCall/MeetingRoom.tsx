import type React from "react";
import { useCallback, useMemo, useState } from "react";
import {
	CallingState,
	useCallStateHooks,
	PaginatedGridLayout,
	CallParticipantsList,
	CallStatsButton,
	type CallControlsProps,
	SpeakingWhileMutedNotification,
	ToggleAudioPublishingButton,
	ReactionsButton,
	RecordCallButton,
	ToggleVideoPublishingButton,
	CancelCallButton,
	ScreenShareButton,
	ParticipantView,
	SpeakerLayout,
} from "@stream-io/video-react-sdk";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutList, Users, MessageSquare, MoreHorizontal, Image } from "lucide-react";
import EndCallButton from "./EndCallButton";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import "./SpeakerView.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChatUI } from "../organisms/ChatUI";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { VideoEffectsSettings } from "./VideoEffects";
import { usePersistedVideoFilter } from "@/hooks/usePersistedVideoFilter";
import { TranscriptionButton } from "./TranscriptionButton";

interface MeetingRoomProps {
	name: string;
	token: string;
	apiKey: string;
	meetingId: string;
	isModerator: boolean;
	id: string;
}
type CallLayoutType =
	| "grid"
	| "speaker-left"
	| "speaker-right"
	| "speaker-top"
	| "speaker-bottom";

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
	meetingId,
	isModerator,
}) => {
	const [layout, setLayout] = useState<CallLayoutType>("speaker-top");
	const [showParticipants, setShowParticipants] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const isMobile = useMediaQuery("(max-width: 700px)");

	const { useCallCallingState, useScreenShareState } = useCallStateHooks();
	const callingState = useCallCallingState();

  const { useParticipants } = useCallStateHooks();
  const allParticipants = useParticipants();
  usePersistedVideoFilter('video-filter');
  
  const participantWithScreenShare = useMemo(() => allParticipants.find(participant => participant.screenShareStream?.active), [allParticipants]);

	const CallLayout = useCallback(() => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout 
          pageArrowsVisible
        />;
			case "speaker-right":
				return (
					<SpeakerLayout
						pageArrowsVisible
						participantsBarLimit="dynamic"
						participantsBarPosition="left"
					/>
				);
			case "speaker-bottom":
				return (
					<SpeakerLayout
						pageArrowsVisible
						participantsBarLimit="dynamic"
						participantsBarPosition="top"
					/>
				);
			case "speaker-top":
				return (
					<SpeakerLayout
						pageArrowsVisible
						participantsBarLimit="dynamic"
						participantsBarPosition="bottom"
					/>
				);
			default:
				return (
					<SpeakerLayout
						pageArrowsVisible
						participantsBarLimit="dynamic"
						participantsBarPosition="right"
					/>
				);
		}
	}, [layout]);

	if (callingState !== CallingState.JOINED) return <Loader />;

	const toggleParticipants = () => {
		setShowParticipants((prev) => !prev);
		if (!showParticipants) {
			setShowChat(false);
		}
	};

	const toggleChat = () => {
		setShowChat((prev) => !prev);
		if (!showChat) {
			setShowParticipants(false);
		}
	};

	return (
		<section className="relative h-screen w-full overflow-hidden text-white">
			<div className="relative flex w-[100dvw] h-[inherit] items-center justify-center">
				<div
					className={cn("flex size-full items-center justify-center ml-2 flex-col gap-2", {
						"ml-0": !showChat && !showParticipants,
            "size-fit": layout === 'grid' && participantWithScreenShare?.screenShareStream?.active
					})}
				>
					{(layout === 'grid' && participantWithScreenShare?.screenShareStream?.active) && (
						<div className="flex items-center justify-center w-full lg:w-2/3">
							<ParticipantView participant={participantWithScreenShare} trackType="screenShareTrack" />
						</div>
					)}
					<div className={cn("relative w-full h-full content-center", {
						"lg:w-2/3": layout === 'grid' && participantWithScreenShare?.screenShareStream?.active
					})}>
						<CallLayout />
					</div>
				</div>
				{!(!showChat && !showParticipants) && (
					<div
						className={cn("sidebar-container mr-2 min-w-[400px] ml-2", {
							"hidden min-w-0 ml-0 mr-0": !showChat && !showParticipants,
							mobile: isMobile,
						})}
					>
						{showParticipants && (
							<div className="h-full w-full">
								<CallParticipantsList
									onClose={() => setShowParticipants(false)}
								/>
							</div>
						)}
						{showChat && (
							<div className="h-full w-full">
								<ChatUI
									meetingId={meetingId}
									disabledSend={false}
									onClose={() => setShowChat(false)}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="fixed bottom-4 left-0 right-0 flex justify-center">
				<div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-neutral-900 bg-opacity-80 rounded-full">
					<CallControls
						isModerator={isModerator}
						onLeave={() => window.close()}
					/>
					
					{!isModerator && (
						<button type="button" onClick={toggleChat} className="control-button">
							<MessageSquare size={20} />
						</button>
					)}
					
					{isModerator && (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger className="control-button">
									<MoreHorizontal size={20} />
								</DropdownMenuTrigger>
								<DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
									<DropdownMenuItem onClick={toggleParticipants}>
										<Users size={20} className="mr-2" />
										Participantes
									</DropdownMenuItem>
									<DropdownMenuItem onClick={toggleChat}>
										<MessageSquare size={20} className="mr-2" />
										Chat
									</DropdownMenuItem>
									<DropdownMenuItem>
										<EndCallButton />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							
							<CallStatsButton />
						</>
					)}
					
					<DropdownMenu>
						<DropdownMenuTrigger className="control-button">
							<LayoutList size={20} />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
							{Object.entries({
								'grid': 'Grade',
								'speaker-left': 'Palestrante à Esquerda',
								'speaker-right': 'Palestrante à Direita',
								'speaker-top': 'Palestrante em Cima',
								'speaker-bottom': 'Palestrante em Baixo'
							}).map(([key, value]) => (
								<DropdownMenuItem
									key={key}
									onClick={() => setLayout(key as CallLayoutType)}
								>
									{value}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</section>
	);
};

const CallControls = ({
	onLeave,
	isModerator,
}: CallControlsProps & { isModerator: boolean }) => (
	<>
		<ReactionsButton />
		<SpeakingWhileMutedNotification>
			<ToggleAudioPublishingButton />
		</SpeakingWhileMutedNotification>
		{isModerator && (
		<>
			<RecordCallButton />
			<TranscriptionButton />
		</>
		)}
		<ToggleVideoPublishingButton />
		<ScreenShareButton />
		<VideoEffectsButton />
		<CancelCallButton onLeave={onLeave} />
	</>
);

export const VideoEffectsButton = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className="bg-[#19232d] w-9 h-9 rounded-full items-center justify-center hover:bg-[#323b44] flex" type="button" title="Efeitos de Vídeo">
					<Image size={18} />
				</button>
			</DialogTrigger>
			<DialogContent className="bg-neutral-900 text-white border-dark-1 video-modal-content">
				<VideoEffectsSettings />
			</DialogContent>
		</Dialog>
	);
};
