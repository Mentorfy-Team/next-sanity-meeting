import { useState, useEffect, useRef } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Send } from 'lucide-react';
import { useUserStore } from '@/hooks/userStore';

export function ChatUI({ meetingId, disabledSend, shouldFixMessage, onClose }: { meetingId: string, disabledSend: boolean, shouldFixMessage?: string, onClose: () => void }) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ user: string; message: string; isFixed: boolean }[]>([]);
  const [allowAllMessages, setAllowAllMessages] = useState<boolean>(true);
  const channel = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { name: user, isModerator } = useUserStore();

  useEffect(() => {
    if (!channel.current) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
      );

      channel.current = client.channel(`chat-room-${meetingId}`, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      channel.current
        .on("broadcast", { event: "message" }, ({ payload }) => {
          setMessages((prev) => [...prev, payload.message]);
        })
        .subscribe();

      // Add fixed message to messages if it exists
      if (shouldFixMessage) {
        setMessages(prev => [{ user: 'System', message: shouldFixMessage, isFixed: true }, ...prev]);
      }
    }

    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [meetingId, shouldFixMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function onSend() {
    if (!channel.current || message.trim().length === 0 || disabledSend) return;
    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, user, isModerator, isFixed: shouldFixMessage } },
    });
    setMessage("");
  }

  return (
    <div className="w-full max-w-2xl bg-white text-black p-4 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mensagens na chamada</h2>
        <button type="button" className="text-gray-500 hover:text-gray-700" onClick={() => onClose()}>
          <X size={24} />
        </button>
      </div>
      
      {isModerator && (
        <div className="bg-gray-100 p-4 rounded-md mb-4 flex items-center justify-between">
          <span className="text-sm">Permitir que todos os participantes enviem mensagens</span>
          <Switch 
            checked={allowAllMessages}
            onCheckedChange={setAllowAllMessages}
          />
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-md mb-4 text-sm text-center text-gray-600">
        A menos que estejam fixadas, as mensagens só aparecem para as pessoas na chamada quando são enviadas, e são excluídas quando a ligação é encerrada.
      </div>
      
      <div className="flex-grow overflow-hidden flex flex-col">
        <div className="flex-grow overflow-y-auto space-y-3 mb-4">
          {messages?.filter(msg => msg.isFixed)?.map((msg, i) => (
            <div key={i} className="bg-blue-100 p-3 rounded-md mb-2">
              <p className="text-sm font-semibold">Mensagem Fixa</p>
              <p className="text-sm">{msg.message}</p>
            </div>
          ))}
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${user === msg.user ? 'justify-end' : ''}`}>
              {user !== msg.user && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={msg.user} />
                  <AvatarFallback className='bg-[#9dd6ff]'>{msg.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div className={`p-3 rounded-md flex-grow ${
                user === msg.user ? 'bg-gray-800 text-white max-w-[80%]' : 'bg-gray-100'
              }`}>
                <p className="text-sm font-semibold mb-1">{msg.user}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
              {user === msg.user && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={msg.user} />
                  <AvatarFallback className='bg-[#ffc772]'>{msg.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="bg-gray-100 p-2 rounded-md flex items-center">
          <Input 
            type="text"
            placeholder="Enviar uma mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter" && !disabledSend) {
                onSend();
              }
            }}
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm"
            disabled={disabledSend || (!isModerator && !allowAllMessages)}
          />
          <button 
            type="button"
            onClick={onSend} 
            className={`ml-2 text-gray-500 hover:text-gray-700 ${(disabledSend || (!isModerator && !allowAllMessages)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabledSend || (!isModerator && !allowAllMessages)}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
