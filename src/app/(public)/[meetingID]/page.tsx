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

import {
  HomeIcon,
} from "@radix-ui/react-icons"
import { trpc } from "@/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { MicrophoneOnIcon } from "@/components/icons/microphone"
import { CameraOffIcon, CameraOnIcon } from "@/components/icons/camera"
import clsx from "clsx"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

type Props = {
  params: {
    meetingID: string,
    refreshToken: string,
  }
}


export default function Project({ params: { meetingID } }: Props) {
  const supabase = createClientComponentClient();
  const [usePassword, setUsePassword] = useState(false);
  const route = useRouter();

  const { mutateAsync: joinAsAttendee } = trpc.meeting.joinAsAttendee.useMutation();
  const { data: room, isLoading } = trpc.meeting.getRoom.useQuery({ meetingID });

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

  useEffect(() => {
    // Acessar a câmera e o microfone e armazená-los no estado
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
        setMediaStream(stream); // Armazenar a stream no estado
      })
      .finally(() => {
        // Listar dispositivos de áudio e vídeo
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
          setVideoDevices(devices.filter(device => device.kind === 'videoinput'));
          setOutputDevices(devices.filter(device => device.kind === 'audiooutput'));
        });
      })
      .catch((err) => console.log(err));

  }, []);

  const updateMediaStream = (type, deviceId) => {
    if (type === 'audiooutput') {
      const audio = videoRef.current;
      if (audio) {
        audio.setSinkId(deviceId);
      }
      setSelectedOutputDevice(deviceId);
      return;
    } else if (mediaStream) {
      let mediaType = type === 'audioinput' ? 'audio' : 'video';

      const tracks = mediaStream.getTracks();
      tracks.forEach((track) => {
        if (track.kind === mediaType) {
          track.stop(); // Parar o track atual
        }
      });

      const constraints = { [mediaType]: { deviceId: { exact: deviceId } } };

      navigator.mediaDevices.getUserMedia(constraints).then((newStream) => {
        const newTrack = newStream.getTracks().find((track) => track.kind === mediaType);
        const video = videoRef.current;
        if (video && newTrack) {
          mediaStream.addTrack(newTrack);
          video.srcObject = mediaStream;
        }

        if (mediaType === 'audio') {
          setSelectedAudioDevice(deviceId);
        } else {
          setSelectedVideoDevice(deviceId);
        }
      }).catch(err => {
        console.error("Failed to get user media:", err);
      });
    }
  };

  useEffect(() => {
    if (!cameraEnabled) {
      videoRef?.current?.srcObject?.getVideoTracks().forEach(track => track.enabled = false);
    } else {
      videoRef?.current?.srcObject?.getVideoTracks().forEach(track => track.enabled = true);
    }

    // disable mediaDevices audio if microphone is disabled
    if (!microphoneEnabled) {
      mediaStream?.getAudioTracks().forEach(track => track.kind === 'audio' && (track.enabled = false));
    } else {
      mediaStream?.getAudioTracks().forEach(track => track.kind === 'audio' && (track.enabled = true));
    }

  }, [cameraEnabled, microphoneEnabled, mediaStream]);

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
          {/* Desabilitado até customização do BBB HTML para aceitar */}
          {isLoading && (
            <Icons.spinner className="animate-spin w-12 h-12 text-primary-500 mx-auto" />
          )}
          {!isLoading && <>
            {false && <div>
              <div className="relative w-full max-w-2xl h-[280px] lg:w-[640px] lg:h-[360px] mb-4 bg-zinc-950 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                ></video>
                {!cameraEnabled && <div className="absolute scale-150 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <CameraOffIcon />
                </div>}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button data-active={microphoneEnabled} className={cn("p-2 rounded-full data-[active=true]:bg-green-500 bg-red-400")} onClick={() => setMicrophoneEnabled(!microphoneEnabled)}>
                    {/* Ícone do microfone */}
                    <MicrophoneOnIcon />
                  </button>
                  <button data-active={cameraEnabled} className={cn("p-2 rounded-full data-[active=true]:bg-green-500 bg-red-400")} onClick={() => setCameraEnabled(!cameraEnabled)}>
                    {/* Ícone da câmera */}
                    <CameraOnIcon />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                {audioDevices?.length > 0 && audioDevices[0].deviceId && <div>
                  <Label>Microfone</Label>
                  <Select defaultValue={audioDevices[0]?.deviceId} onValueChange={(e) => updateMediaStream('audioinput', e)}>
                    <SelectTrigger className="w-[180px] truncate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Microfones</SelectLabel>
                        {audioDevices.map((device, index) => (
                          <SelectItem key={index} value={device.deviceId}>{device.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>}

                {videoDevices?.length > 0 && videoDevices[0].deviceId && <div>
                  <Label>Câmera</Label>
                  <Select defaultValue={videoDevices[0]?.deviceId} onValueChange={(e) => updateMediaStream('videoinput', e)}>
                    <SelectTrigger className="w-[180px] truncate">
                      <SelectValue placeholder="Câmera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Câmeras</SelectLabel>
                        {videoDevices.map((device, index) => (
                          <SelectItem key={index} value={device.deviceId}>{device.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>}

                {outputDevices?.length > 0 && outputDevices[0].deviceId && <div>
                  <Label>Saída de áudio</Label>
                  <Select defaultValue={outputDevices[0]?.deviceId} onValueChange={(e) => updateMediaStream('audiooutput', e)}>
                    <SelectTrigger className="w-[180px] truncate">
                      <SelectValue placeholder="Saída de áudio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Saída de Áudio</SelectLabel>
                        {outputDevices.map((device, index) => (
                          <SelectItem key={index} value={device.deviceId}>{device.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>}
              </div>
            </div>}
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
                    <Checkbox id="use-password" checked={usePassword} onCheckedChange={(e) => setUsePassword(e)} />
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
                  <Button disabled={!RoomEnableToJoin()} type="submit">Entrar</Button>
                </form>
              </Form>
            </div></>}
        </div>
      </div>
    </div>
  </div>
} 