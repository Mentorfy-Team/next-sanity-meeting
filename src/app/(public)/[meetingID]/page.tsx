'use client'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { useUserStore } from '@/hooks/userStore';
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import HttpBackendClient from "@/utils/server"
import { toast } from "@/components/ui/use-toast"

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
  const isModerator = searchParams?.get('moderator') === 'true';
  const role = searchParams?.get('role') ?? 'attendee';
  const pass = searchParams?.get('pass') ?? role === 'moderator' ? 'mp' : 'ap';
  

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [joinError, setJoinError] = useState(false);

  const { name: userName, setName, setMeetingId, setIsModerator, setRoom: setStoreRoom } = useUserStore();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/room/${meetingID}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar sala');
        }
        const data = await response.json();
        setRoom(data);
        setStoreRoom(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [meetingID, setStoreRoom]);

  useEffect(() => {
    if (isModerator || room?.configs?.guestAsModerator) {
      setIsModerator(true);
    }
    if (meetingID) {
      setMeetingId(meetingID);
    }
  }, [isModerator, room, meetingID, setIsModerator, setMeetingId]);

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
      name: userName || '',
    },
  })

  useEffect(() => {
    // Carrega o nome do localStorage quando o componente monta
    const savedName = localStorage.getItem('userName');
    if (savedName && !userName) {
      setName(savedName);
      form.setValue('name', savedName);
    }
  }, [setName, form, userName]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setJoinError(false);
    setName(values.name);
    // Salva o nome no localStorage
    localStorage.setItem('userName', values.name);
    
    if (values.password) {
      // Implementar verificação de senha se necessário
      setIsModerator(true);
    }
    
    try {
      const response = await HttpBackendClient.get(`/live/join?meetingId=${meetingID}&userName=${values.name}&role=${role ?? 'attendee'}&password=${pass ?? 'ap'}`);
      if(response.data.joinUrl) {
        window.location.href = response.data.joinUrl;
      } else {
        setJoinError(true);
        toast({
          title: 'Erro ao entrar na reunião',
          description: response.data.message,
        });
        // Força reset do estado de submissão
        form.reset(values);
      }
    } catch (error) {
      setJoinError(true);
      toast({
        title: 'Erro ao entrar na reunião',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
      });
      // Força reset do estado de submissão
      form.reset(values);
    }
  }

  const RoomEnableToJoin = () => {
    if (!room?.appointment_date) return false;

    const appointmentDate = new Date(room?.appointment_date);
    const now = new Date();
    return (appointmentDate.getTime() - now.getTime() <= 5 * 60 * 1000);
  };

  const hasMeetingStarted = () => {
    if (room?.appointment_date) {
      const appointmentDate = new Date(room?.appointment_date);
      if (RoomEnableToJoin()) {
        return 'A reunião já começou';
      }
      return <p>A reunião começa em<p className="text-primary-500 font-bold">{appointmentDate.toLocaleDateString()} às {appointmentDate.toLocaleTimeString()}</p></p>;
    }
  };

  const ButtonSubmit = useCallback(({ children }: React.PropsWithChildren<unknown>) => {
    return <Button type="submit"
      disabled={form.formState.isSubmitting || form.getValues('name') === ''}
    >{form.formState.isSubmitting ? 
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : 
        null}
      {joinError ? "Tentar novamente" : children}
    </Button>
  }, [form.formState.isSubmitting, form.getValues, joinError]);

  return <div className="h-full flex items-center justify-center">
    <div className="flex flex-col items-center justify-center bg-gray-750 rounded-lg p-4">
      <div className="p-4">
        <div className="flex flex-col gap-12 lg:flex-row items-center">
          {isLoading && (
            <Icons.spinner className="animate-spin w-12 h-12 text-primary-500 mx-auto" />
          )}
          {!isLoading &&
            <div className="flex flex-col w-[300px] gap-4 justify-center">
              <div className="mb-6">
                <h2 className="text-3xl mb-2 text-center">{room?.room_name || 'Sala de Reunião'}</h2>
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
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )} />
                  <div className="flex gap-4">
                    <Checkbox id="use-password" checked={usePassword} onCheckedChange={(e) => setUsePassword(Boolean(e))} />
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
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )} />}
                  <ButtonSubmit>Entrar</ButtonSubmit>
                </form>
              </Form>
            </div>}
        </div>
      </div>
    </div>
  </div>
}
