import { z } from "zod";
import xml2js from "xml2js";
import { cookies } from 'next/headers'

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { BigBlueButtonAPI } from "../../utils/BBB-API";
import { saveSetCookies } from "./functions";
import { SupabaseAdmin } from "../../utils/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/@types/supabase/v2.types";

export const meetingRouter = createTRPCRouter({
  createRoom: handleCreateRoom(),
  joinAsModerator: handleJoinAsModerator(),
  joinAsAttendee: handleJoinAsAttendee(),
  getRoom: handleGetRoom(),
  getMeetingInfo: handleGetMeetingInfo(),
  getRecordings: handleGetRecordings(),
  createWebhook: handleCreateWebhook(),
  removeWebhook: handleRemoveWebhook(),
  listWebhooks: handleListWebhooks(),
});

function handleJoinAsModerator() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/join-room-mod" } })
    .input(z.object({
      meetingID: z.string(),
      name: z.string(),
    }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string(),
      message: z.string(),
      meeting_id: z.string(),
      user_id: z.string(),
      auth_token: z.string(),
      session_token: z.string(),
      guestStatus: z.string(),
      url: z.string(),
      cookie: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { meetingID, name } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data, headers } = await bbb.joinAsModerator(name, meetingID);

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingJoin };

      saveSetCookies(headers);

      return { ...response, cookie: headers["set-cookie"] };
    });
}

function handleJoinAsAttendee() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/join-room" } })
    .input(z.object({
      meetingID: z.string(),
      name: z.string(),
      password: z.string().optional(),
    }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string(),
      message: z.string(),
      meeting_id: z.string(),
      user_id: z.string(),
      auth_token: z.string(),
      session_token: z.string(),
      guestStatus: z.string(),
      url: z.string(),
      cookie: z.any(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { meetingID, name, password } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const supabase = createServerActionClient<Database>({ cookies });

      const { data: userResponse } = await supabase.auth.getUser();

      const { data: meeting } = await supabase.from("meeting")
        .select("*")
        .or(`friendly_id.eq.${meetingID}`)
        .single();

      if (!meeting) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sala não encontrada",
        });
      }

      const { data: meetingResponse } = await bbb.createRoom({
        meetingID: meeting.friendly_id!,
        guestPolicy: "ALWAYS_ACCEPT",
        roomName: meeting.room_name!,
        ...(meeting.configs as {}),
      });

      if (meetingResponse?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: meetingResponse.response.message,
        });
      }
      const { response: createdMeeting } = (await convertXmlToObject(meetingResponse)) as { response: MeetingCreated };

      const isMod = userResponse?.user?.id === meeting?.owner_id || (meeting.configs as any)?.guestAsModerator;

      const { data, headers } = await bbb.joinAsAttendee(name, createdMeeting.meetingID, password, true);//temp

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingJoin };

      saveSetCookies(headers);

      return { ...response };
    });
}

function handleCreateRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/create-room" } })
    .input(z.object({
      meetingID: z.string(),
      owner: z.string().optional(),
      roomName: z.string().optional(),
      guestPolicy: z.string().optional(),
    }))
    .output(
      z.object({
        returncode: z.string(),
        meetingID: z.string(),
        internalMeetingID: z.string(),
        parentMeetingID: z.string(),
        attendeePW: z.string().optional(),
        moderatorPW: z.string().optional(),
        createTime: z.string(),
        voiceBridge: z.string().optional(),
        dialNumber: z.string().optional(),
        createDate: z.string(),
        hasUserJoined: z.string(),
        duration: z.string().optional(),
        hasBeenForciblyEnded: z.string().optional(),
        messageKey: z.string().optional(),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { meetingID, guestPolicy, owner, roomName } = input;

      // use BigBlueButtonAPI to create a room
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.createRoom({
        meetingID, guestPolicy, roomName: roomName || 'Sala de Reunião', moderatorPW: "mp", owner
      });

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingCreated };
      console.log(response);

      return {
        ...response,
      };
    });
}

function handleGetRecordings() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/recordings" } })
    .input(z.object({
      meetingID: z.string().optional(),
      recordID: z.string().optional(),
      userId: z.string().optional(),
      offset: z.number().optional(),
      limit: z.number().optional(),
    }))
    .output(z.object({
      returncode: z.string().optional(),
      recordings: z.any(),
    }))
    .mutation(async ({ input: { meetingID, recordID, userId, offset, limit } }) => {

      const bbb = new BigBlueButtonAPI();
      let userMeetingsIDs;

      if (userId) {
        const { data: meetings } = await SupabaseAdmin()
          .from('meeting')
          .select('friendly_id')
          .eq('owner_id', userId);

        userMeetingsIDs = meetings?.filter((meeting: any) => meeting.friendly_id).map((meeting: any) => meeting.friendly_id).join(',') || '0';
      }

      const { data } = await bbb.getRecordings(userMeetingsIDs ?? meetingID, recordID, offset, limit);

      if (data?.response?.message) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: MeetingRecordings };
      
      let listOfRecordings = [];
      if (response?.recordings?.recording?.length > 0) {
        listOfRecordings = response?.recordings?.recording;
      } else {
        if(!response?.recordings?.recording){
          listOfRecordings = []
        }else{
          listOfRecordings = [response?.recordings?.recording as unknown as Recording]
        }
      }
      
      try {
        listOfRecordings = listOfRecordings?.map((recording) => {
          const { playback } = recording;
          const { format } = playback;
          const { url } = format;
          const newUrl = url.replace('meeting', 'meet');
          return {
            ...recording,
            playback: {
              ...playback,
              format: {
                ...format,
                url: newUrl,
              }
            },
          };
        });
      } catch (error) {
        console.error(error);
      }
      
      const result = {
        ...response,
        recordings: listOfRecordings
      };
      
      return result;
    });
}

function handleGetRoom() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/room/:meetingID" } })
    .input(z.object({
      meetingID: z.string(),
    }))
    .output(
      z.object({
        appointment_date: z.string().nullable().refine(date => date && !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        appointment_finished_at: z.null().optional(),
        date_created: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        date_updated: z.string().refine(date => !isNaN(Date.parse(date)), {
          message: 'Data inválida'
        }),
        friendly_id: z.string(),
        id: z.string().uuid(),
        invite_url: z.string().url().nullable().optional(),
        owner_id: z.string().uuid(),
        recording_url: z.string().url().nullable().optional(),
        room_name: z.string(),
        sort: z.null().optional(),
        status: z.any(),
        type: z.string(),
        url: z.string().url()
      })
    )
    .query(async ({ input: { meetingID } }) => {
      const supabase = SupabaseAdmin();

      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("friendly_id", meetingID)
        .single();


      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      return data;
    });
}

function handleCreateWebhook() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "POST", path: "/webhooks-create/" } })
    .input(z.object({
      meetingID: z.string().optional(),
      callbackURL: z.string(),
      eventID: z.string().optional(),
      getRaw: z.boolean().optional(),
    }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string().optional(),
      message: z.string().optional(),
    }))
    .mutation(async ({ input: { meetingID, callbackURL, eventID, getRaw } }) => {
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.createWebhook(callbackURL, meetingID, eventID, getRaw);
      const { response } = (await convertXmlToObject(data)) as { response: MeetingCreated };

      return {
        returncode: response.returncode,
        messageKey: response.messageKey,
        message: response.message,
      };
    });
}

function handleRemoveWebhook() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "POST", path: "/webhooks-remove/" } })
    .input(z.object({
      hookID: z.string(),
    }))
    .output(z.boolean())
    .query(async ({ input: { hookID } }) => {
      const bbb = new BigBlueButtonAPI();

      await bbb.removeWebhook(hookID);

      return true;
    });
}

function handleListWebhooks() {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "POST", path: "/webhooks-list/" } })
    .input(z.object({
      meetingID: z.string().optional(),
    }))
    .output(z.object({
      returncode: z.string(),
      hooks: z.object({
        hook: z.union([
          z.object({
            hookID: z.string(),
            callbackURL: z.string(),
            meetingID: z.string().optional(),
            permanentHook: z.string(),
            rawData: z.string(),
          }),
          z.array(
            z.object({
              hookID: z.string(),
              callbackURL: z.string(),
              meetingID: z.string().optional(),
              permanentHook: z.string(),
              rawData: z.string(),
            })
          )])})
    }))
    .query(async ({ input: { meetingID } }) => {
      const bbb = new BigBlueButtonAPI();

      const { data } = await bbb.listWebhooks(meetingID);
      const { response } = (await convertXmlToObject(data)) as { response: MeetingHookRegistred };
      console.log(response.hooks?.hook)
      return response;
    });
}

// attendees: {
//   attendee: {
//     userID: 'w_wx6ynzkt8ben',
//     fullName: 'Jones Albert Rios',
//     role: 'MODERATOR',
//     isPresenter: 'true',
//     isListeningOnly: 'false',
//     hasJoinedVoice: 'true',
//     hasVideo: 'false',
//     clientType: 'HTML5'
//   }
// },

function handleGetMeetingInfo(): any {
  return publicProcedure
    .meta({ /* 👉 */ openapi: { method: "GET", path: "/meeting-info" } })
    .input(z.object({
      meetingID: z.string(),
    }))
    .output(z.object({
      returncode: z.string(),
      messageKey: z.string().optional(),
      message: z.string().optional(),
      meetingName: z.string().optional(),
      meetingID: z.string().optional(),
      internalMeetingID: z.string().optional(),
      createTime: z.string().optional(),
      createTimestamp: z.string().optional(),
      voiceBridge: z.string().optional(),
      dialNumber: z.string().optional(),
      attendeePW: z.string().optional(),
      moderatorPW: z.string().optional(),
      running: z.string().optional(),
      duration: z.string().optional(),
      hasUserJoined: z.string().optional(),
      recording: z.string().optional(),
      hasBeenForciblyEnded: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      participantCount: z.string().optional(),
      listenerCount: z.string().optional(),
      voiceParticipantCount: z.string().optional(),
      videoCount: z.string().optional(),
      maxUsers: z.string().optional(),
      moderatorCount: z.string().optional(),
      attendeeCount: z.string().optional(),
      attendees: z.array(
        z.object({
          userID: z.string(),
          fullName: z.string(),
          role: z.string(),
          isPresenter: z.string(),
          isListeningOnly: z.string(),
          hasJoinedVoice: z.string(),
          hasVideo: z.string(),
          clientType: z.string(),
        })
      ),
    }))
    .query(async ({ input: { meetingID } }) => {
      const bbb = new BigBlueButtonAPI();

      const { data: meetings } = await bbb.getMeetings();
      console.log(meetings)

      const { data } = await bbb.getMeetingInfo(meetingID);

      if(data?.response?.returncode === 'FAILED'){
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: data.response.message+` (${meetingID})`,
        });
      }
      const { response } = (await convertXmlToObject(data)) as { response: any };
      
      //fix attendees
      let attendees = [];
      if (response?.attendees?.attendee?.length > 0) {
        attendees = response?.attendees?.attendee;
      } else {
        if(!response?.attendees?.attendee){
          attendees = []
        }else{
          attendees = [response?.attendees?.attendee as unknown as Recording]
        }
      }
      response.attendees = attendees;

      return response;
    });
}

function convertXmlToObject(xmlString: string) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, { explicitArray: false }, (err: any, result: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export type MeetingHookCreated = {
  returncode: string;
  messageKey?: string;
  message?: string;
  hookID?: string;
};

export type MeetingHookDeleted = {
  returncode: string;
  messageKey?: string;
  message?: string;
  removed?: string;
};

export type MeetingHookRegistred = {
  returncode: string;
  hooks?: {
   hook: hook[] | hook
  }
};

type hook = {
  hookID: string;
  callbackURL: string;
  meetingID?: string;
  permanentHook: string;
  rawData: string;
 };

export type MeetingCreated = {
  returncode: string;
  meetingID: string;
  internalMeetingID: string;
  parentMeetingID: string;
  attendeePW: string;
  moderatorPW: string;
  createTime: string;
  voiceBridge: string;
  dialNumber: string;
  createDate: string;
  hasUserJoined: string;
  duration: string;
  hasBeenForciblyEnded: string;
  messageKey: string;
  message: string;
};

type MeetingJoin = {
  returncode: string;
  messageKey: string;
  message: string;
  meeting_id: string;
  user_id: string;
  auth_token: string;
  session_token: string;
  guestStatus: string;
  url: string;
};


type Image = {
  _: string;
  $: {
    width: string;
    height: string;
    alt: string;
  };
};

type Preview = {
  images: {
    image: Image[];
  };
};

type Format = {
  type: string;
  url: string;
  processingTime: string;
  length: string;
  size: string;
  preview: Preview;
};

type Playback = {
  format: Format;
};

type Metadata = {
  "bbb-recording-ready-url": string;
  "bbb-origin-version": string;
  endcallbackurl: string;
  meetingName: string;
  meetingId: string;
  "bbb-origin": string;
  isBreakout: string;
};

type Breakout = {
  parentId: string;
  sequence: string;
  freeJoin: string;
};

type Recording = {
  recordID: string;
  meetingID: string;
  internalMeetingID: string;
  name: string;
  isBreakout: string;
  published: string;
  state: string;
  startTime: string;
  endTime: string;
  participants: string;
  rawSize: string;
  metadata: Metadata;
  breakout: Breakout;
  size: string;
  playback: Playback;
  data: string;
};

type MeetingRecordings = {
  returncode: string;
  recordings: { recording: Recording[] };
};

const Image = z.object({
  _: z.string(),
  $: z.object({
    width: z.string(),
    height: z.string(),
    alt: z.string(),
  }),
});

const Preview = z.object({
  images: z.object({
    image: z.array(Image),
  }),
});

const Format = z.object({
  type: z.string(),
  url: z.string(),
  processingTime: z.string(),
  length: z.string(),
  size: z.string(),
  preview: Preview,
});

const Playback = z.object({
  format: Format,
});

const Metadata = z.object({
  "bbb-recording-ready-url": z.string(),
  "bbb-origin-version": z.string(),
  endcallbackurl: z.string(),
  meetingName: z.string(),
  meetingId: z.string(),
  "bbb-origin": z.string(),
  isBreakout: z.string(),
});

const Breakout = z.object({
  parentId: z.string(),
  sequence: z.string(),
  freeJoin: z.string(),
});

const Recording = z.object({
  recordID: z.string(),
  meetingID: z.string(),
  internalMeetingID: z.string(),
  name: z.string(),
  isBreakout: z.string(),
  published: z.string(),
  state: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  participants: z.string(),
  rawSize: z.string(),
  metadata: Metadata,
  breakout: Breakout,
  size: z.string(),
  playback: Playback,
  data: z.string(),
});

const Payload = z.object({
  returncode: z.string(),
  recordings: z.array(Recording),
});
