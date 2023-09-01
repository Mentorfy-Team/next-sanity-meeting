'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trpc } from "@/utils/trpc"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(0, {
    message: "Username must be at least 2 characters.",
  }),
})

const CreateRoomButton = ({ onRoomCreated }: { onRoomCreated: (values: any) => void }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Sala de Reunião",
    },
  })

  const { mutateAsync } = trpc.meeting.createRoom.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = await mutateAsync(values);
    onRoomCreated(data);
    setOpen(false);
  }

  return (

    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant="outline" className=" bg-primary-500 justify-start" onClick={() => setOpen(true)}>
          Criar sala
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 flex-col">
            <DialogHeader>
              <DialogTitle>
                Criar nova sala
              </DialogTitle>
              <DialogDescription>
                Crie uma sala para realizar reuniões, mentorias ou eventos.
              </DialogDescription>
            </DialogHeader>
            <FormField
              key='name'
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Sala</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    {/* This is your public display name. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            <DialogFooter>
              <Button type="submit">
                Criar sala
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
}

export default CreateRoomButton