'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSearchParams } from 'next/navigation';
import { trpc } from "@/utils/trpc";
import { useCallback, useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import zipy from "zipyai";
type Props = {
  params: {
    meetingID: string,
    ref: string,
  }
}


export default function Project({ params: { meetingID } }: Props) {
  const [usePassword, setUsePassword] = useState(false);
  const route = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams?.get('ref') || '';

  const { mutateAsync: joinAsAttendee } = trpc.meeting.joinAsAttendee.useMutation();
  const { data: room, isLoading } = trpc.meeting.getRoom.useQuery({ meetingID });
  const { data: user } = trpc.meeting.getSession.useQuery({ ref });

  const loadUser = useCallback(async () => {
    if (user?.first_name) {
      form.setValue('name', user.first_name);
    }

  }, [user]);


  useEffect(() => {
    loadUser();
  }, [user])

  useEffect(() => {
    zipy.init("a5ea71d1").catch(() => console.error("ZipyAI failed to load"));
  }, []);

  useEffect(() => {
    if (user?.first_name) {
      zipy.identify(user?.email, {
        name: user?.first_name,
        email: user?.email,
      })
    }
  }, [user]);

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
    const info = await joinAsAttendee({ meetingID, name: values.name, password: values.password, ref });

    route.push(info.url);

    if (values.name) {
      zipy.identify(values.name, {
        name: values.name,
      })
    }
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

  const ButtonSubmit = useCallback(({ children }: any) => {
    return <Button type="submit"
      disabled={!user && (form.formState.isSubmitting || (form.getValues('name') === ''))}
    >{children}</Button>
  }, [form.formState.isSubmitting, form.getValues('name'), user]);

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
                          <Input placeholder="" {...field} />
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
                  <ButtonSubmit>Entrar</ButtonSubmit>
                </form>
              </Form>
            </div></>}
        </div>
      </div>
    </div>
  </div>
} 