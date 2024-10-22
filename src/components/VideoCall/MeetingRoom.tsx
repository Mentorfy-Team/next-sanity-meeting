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
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutList, Users, MessageSquare, MoreHorizontal } from "lucide-react";
import EndCallButton from "./EndCallButton";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";
import "./SpeakerView.scss";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChatUI } from "../organisms/ChatUI";

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
	const router = useRouter();
	const isMobile = useMediaQuery("(max-width: 700px)");

	const { useCallCallingState, useScreenShareState } = useCallStateHooks();
	const callingState = useCallCallingState();

  const { useParticipants } = useCallStateHooks();
  const allParticipants = useParticipants();
  const screenShareState = useScreenShareState();
  
  const participantWithScreenShare = useMemo(() => allParticipants.find(participant => participant.screenShareStream?.active), [allParticipants]);
  console.log(screenShareState);
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

			<div className="fixed bottom-0 flex w-full items-center justify-center gap-2">
				<div className="control_wrapper flex w-full justify-center items-center">
					{!isModerator && (
						<button type="button" onClick={toggleChat}>
							<div className="cursor-pointer mr-4 rounded-full bg-[#19232d] px-2 py-2 hover:bg-[#4c535b]">
								<MessageSquare size={20} className="text-white" />
							</div>
						</button>
					)}
					<CallControls
						isModerator={isModerator}
						onLeave={() => router.push("/")}
					/>
					{isModerator && (
						<DropdownMenu>
							<DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b] ml-2">
								<MoreHorizontal size={20} className="text-white" />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
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
						</DropdownMenu>
					)}
					{isModerator && (
						<div className="ml-2">
							<CallStatsButton />
						</div>
					)}
					<div className="ml-2">
						<DropdownMenu>
							<DropdownMenuTrigger className="bg-[#19232d] w-9 h-9 rounded-full items-center justify-center hover:bg-[#323b44]">
								<LayoutList size={16} className="inline-block mb-1" />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="border-dark-1 bg-neutral-900 text-white">
								{[
									"Grid",
									"Speaker-Left",
									"Speaker-Right",
									"Speaker-Top",
									"Speaker-Bottom",
								].map((item, index) => (
									<DropdownMenuItem
										key={item}
										className="cursor-pointer"
										onClick={() =>
											setLayout(item.toLowerCase() as CallLayoutType)
										}
									>
										{item}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</section>
	);
};

const CallControls = ({
	onLeave,
	isModerator,
}: CallControlsProps & { isModerator: boolean }) => (
	<div className="str-video__call-controls">
		<ReactionsButton />
		<SpeakingWhileMutedNotification>
			<ToggleAudioPublishingButton />
		</SpeakingWhileMutedNotification>
		{isModerator && <RecordCallButton />}
		<ScreenShareButton />
		<ToggleVideoPublishingButton />
		<CancelCallButton onLeave={onLeave} />
	</div>
);
