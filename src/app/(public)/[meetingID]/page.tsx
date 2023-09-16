'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  HomeIcon,
} from "@radix-ui/react-icons"
import { trpc } from "@/utils/trpc";
import { useCallback, useEffect, useRef, useState } from "react";
import { MicrophoneOnIcon } from "@/components/icons/microphone"
import { CameraOffIcon, CameraOnIcon } from "@/components/icons/camera"
import clsx from "clsx"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import zipy from "zipyai";
import { Database } from "@/@types/supabase/v2.types"
type Props = {
  params: {
    meetingID: string,
    refreshToken: string,
  }
}


export default function Project({ params: { meetingID } }: Props) {
  const [usePassword, setUsePassword] = useState(false);
  const route = useRouter();

  const { mutateAsync: joinAsAttendee } = trpc.meeting.joinAsAttendee.useMutation();
  const { data: room, isLoading } = trpc.meeting.getRoom.useQuery({ meetingID });
  const supabase = createClientComponentClient<Database>();

  const [mediaStream, setMediaStream] = useState(null);
  const [name, setName] = useState('');

  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);

  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedOutputDevice, setSelectedOutputDevice] = useState(null);

  const videoRef = useRef(null);

  const loadUser = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (data?.session?.user && !error) {
      const { data: profileData, error: profError } = await supabase.from('profile').select('name, email, id, avatar').eq('email', data.session?.user.email!).maybeSingle();

      if (!profError) {
        form.setValue('name', profileData?.name!)
      }
    }
  }, [room, isLoading]);

  useEffect(() => {
    console.log(isLoading, room);
    loadUser();
  }, [room, isLoading])

  useEffect(() => {
    zipy.init("a5ea71d1").catch(() => console.error("ZipyAI failed to load"));
  }, []);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
      message: "Password must be at least 2 characters.",
    }).optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    //const startedRoom = await startRoom({ meetingID, guestPolicy: 'ASK_MODERATOR' });
    const info = await joinAsAttendee({ meetingID, name: values.name, password: values.password });

    route.push(info.url);
  }

  const RoomEnableToJoin = () => {
    if (!room?.appointment_date) return false;

    const appointmentDate = new Date(room?.appointment_date);
    const now = new Date();
    return (appointmentDate.getTime() - now.getTime() <= 5 * 60 * 1000);
  };

  const hasMeetingStarted = () => {
    // check if room?.appointment_date is in the past
    if (room?.appointment_date) {
      const appointmentDate = new Date(room?.appointment_date);
      if (RoomEnableToJoin()) {
        return 'A reunião já começou';
      } else {
        return <p>A reunião começa em<p className="text-primary-500 font-bold">{appointmentDate.toLocaleDateString()} às {appointmentDate.toLocaleTimeString()}</p></p>;
      }
    }
  };

  return <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center bg-gray-750 rounded-lg p-4">
      <div className="p-4">
        <div className="flex flex-col gap-12 lg:flex-row items-center">
          {isLoading && (
            <Icons.spinner className="animate-spin w-12 h-12 text-primary-500 mx-auto" />
          )}
          {!isLoading && <>

            <div className="flex flex-col w-[300px] gap-4 justify-center">
              <div className="mb-6">
                <h2 className="text-3xl mb-2 text-center">{room?.room_name}</h2>
                {/* Numero de participantes */}
                <p className="text-md text-center">{hasMeetingStarted()}</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 flex-col">
                  <FormField
                    key='name'
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Digite seu nome</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g joão da silva..." {...field} />
                        </FormControl>
                        <FormDescription>
                          {/* This is your public display name. */}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <div className="flex gap-4">
                    {/* use password? */}
                    <Checkbox id="use-password" checked={usePassword} onCheckedChange={(e) => setUsePassword(e as any)} />
                    <Label htmlFor="use-password">Usar senha de acesso</Label>
                  </div>
                  {usePassword && <FormField
                    key='password'
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Digite sua senha" {...field} />
                        </FormControl>
                        <FormDescription>
                          {/* This is your public display name. */}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />}
                  <Button type="submit">Entrar</Button>
                </form>
              </Form>
            </div></>}
        </div>
      </div>
    </div>
  </div>
} 