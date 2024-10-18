import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoomEnableToJoin, hasMeetingStarted } from '@/utils/videoCallUtils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }).optional(),
});

interface LobbyProps {
  onJoinCall: (name: string) => void;
  room: any;
}

export const Lobby: React.FC<LobbyProps> = ({ onJoinCall, room }) => {
  const [usePassword, setUsePassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const ButtonSubmit = useCallback(({ children }: { children: React.ReactNode }) => {
    return (
      <Button
        type="submit"
        disabled={form.formState.isSubmitting || form.getValues('name') === ''}
      >
        {children}
      </Button>
    );
  }, [form.formState.isSubmitting, form.getValues]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (usePassword) {
      if (values.password === room?.password) {
        onJoinCall(values.name);
      } else {
        alert('Senha incorreta');
      }
    } else {
      onJoinCall(values.name);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-gray-750 rounded-lg p-4">
        <div className="p-4">
          <div className="flex flex-col gap-12 lg:flex-row items-center">
            <div className="flex flex-col w-[300px] gap-4 justify-center">
              <div className="mb-6">
                <h2 className="text-3xl mb-2 text-center">{room?.room_name}</h2>
                <p className="text-md text-center">{hasMeetingStarted(room)}</p>
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
                    )}
                  />
                  <div className="flex gap-4">
                    <Checkbox
                      id="use-password"
                      checked={usePassword}
                      onCheckedChange={(e) => setUsePassword(e as boolean)}
                    />
                    <Label htmlFor="use-password">Usar senha de acesso</Label>
                  </div>
                  {usePassword && (
                    <FormField
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
                      )}
                    />
                  )}
                  <ButtonSubmit>Entrar</ButtonSubmit>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
