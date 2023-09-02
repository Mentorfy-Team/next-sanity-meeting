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

import {
  HomeIcon,
} from "@radix-ui/react-icons"
import { trpc } from "@/utils/trpc";
import { useEffect, useRef, useState } from "react";
import { MicrophoneOnIcon } from "@/components/icons/microphone"
import { CameraOnIcon } from "@/components/icons/camera"
import clsx from "clsx"
import { cn } from "@/lib/utils"

type Props = {
  params: { meetingID: string }
}


export default function Project({ params: { meetingID } }: Props) {
  // const slug = params.project;
  // const project = await getProject(slug);
  // const [rooms, setRooms] = useState<MeetingCreated[]>([]);
  const { mutateAsync: joinAsAttendee } = trpc.meeting.joinAsAttendee.useMutation();
  const { mutateAsync: startRoom } = trpc.meeting.createRoom.useMutation();
  const { data: room } = trpc.meeting.getRoom.useQuery({ meetingID });

  // function onRoomCreated(values: any) {
  //   console.log(values);
  //   setRooms([...rooms, values]);
  // }

  // async function joinAsModerator(meetingID: string) {
  //   const join = await mutateAsync({ meetingID });
  //   console.log(join);
  // }
  const [mediaStream, setMediaStream] = useState(null);
  const [name, setName] = useState('');
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [outputDevices, setOutputDevices] = useState([]);

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
    if (mediaStream) {
      let mediaType = type === 'audioinput' ? 'audio' : 'video';
      console.log("Updating media type:", mediaType); // Debugging line

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
      }).catch(err => {
        console.error("Failed to get user media:", err);
      });
    }
  };

  async function joinRoom() {
    if (!name) return;
    const startedRoom = await startRoom({ meetingID });
    const info = await joinAsAttendee({ meetingID: startedRoom.meetingID, name });

    window.open(info.url, '_blank');
  }

  return <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center">
      <div className="p-4">
        <div className="flex flex-col gap-12 lg:flex-row items-center">
          <div>
            <div className="relative w-full max-w-2xl h-[280px] lg:w-[640px] lg:h-[360px] mb-4 bg-zinc-950 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
              ></video>
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
                <Select defaultValue={outputDevices[0]?.deviceId}>
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
          </div>
          <div className="flex flex-col w-[300px] gap-4 justify-center">
            <div>
              <h2 className="text-2xl mb-2 text-center">{room?.room_name}</h2>
              {/* Numero de participantes */}
              <p className="text-sm text-center">A reunião ainda não começou.</p>
            </div>

            <div className="flex mt-2 flex-col gap-4">
              <Input id="name" placeholder="Digite seu nome" onChange={(e) => setName(e.target.value)} />
            </div>
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => joinRoom()}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
} 