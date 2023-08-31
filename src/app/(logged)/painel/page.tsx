'use client'
import { getProject } from "@/sanity/sanity-utils";
import { PortableText } from '@portabletext/react';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Command, CommandInput } from "@/components/ui/command";

import {
  HomeIcon,
} from "@radix-ui/react-icons"
import { trpc } from "@/utils/trpc";
import CreateRoomButton from "./components/CreateRoomButton";
import { useState } from "react";
import { MeetingCreated } from "@/server/api/routers/meeting";

type Props = {
  // params: { project: string }
}


export default function Project({ }: Props) {
  // const slug = params.project;
  // const project = await getProject(slug);
  const [rooms, setRooms] = useState<MeetingCreated[]>([]);
  const { mutateAsync } = trpc.meeting.joinAsAttendee.useMutation();

  function onRoomCreated(values: any) {
    console.log(values);
    setRooms([...rooms, values]);
  }

  async function joinAsModerator(meetingID: string) {
    const join = await mutateAsync({ meetingID });
    console.log(join);
  }

  return <Tabs defaultValue="room" className="">
    <TabsList className="grid grid-cols-2 w-[400px]">
      <TabsTrigger value="room">Salas</TabsTrigger>
      <TabsTrigger value="recording">Gravações</TabsTrigger>
    </TabsList>
    <TabsContent className="mt-4" value="room">
      <div className="flex mb-4 gap-4 justify-between">
        <Command className="w-[200px]">
          <CommandInput placeholder="Search framework..." className="h-9" />
        </Command>
        <CreateRoomButton onRoomCreated={onRoomCreated} />
      </div>
      {rooms.map(room => <Card key={room.meetingID} className="w-[300px]">
        <CardHeader>
          <CardTitle>{room.meetingID}</CardTitle>
          <CardDescription>
            {room.message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={room.} disabled />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button onClick={() => joinAsModerator(room.meetingID)}>Entrar como moderador</Button>
        </CardFooter>
      </Card>)}
    </TabsContent>
    <TabsContent value="recording">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save password</Button>
        </CardFooter>
      </Card>
    </TabsContent>
  </Tabs>
} 