'use client'
import { Database } from "@/@types/supabase/v2.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import zipy from "zipyai";

export function AvatarMenu() {
  const supabase = createClientComponentClient<Database>()

  const [profile, setProfile] = useState<any>()

  useEffect(() => {
    try {
      const getData = async () => {
        const { data } = await supabase.auth.getSession();

        if (data?.session?.user.email) {
          const { data: profileData, error } = await supabase.from('profile').select('name, email, id, avatar, phone').eq('email', data.session?.user.email).maybeSingle();

          if (!error && profileData?.email) {
            zipy.identify(profileData.email, {
              email: profileData?.email,
              name: profileData?.name,
              phone: profileData?.phone,
            })
            profileData && setProfile(profileData)
          }
        }
      }

      const loadSession = async () => {
        try {
          const refreshToken = window.location.search.split('refreshToken=')[1]
          if (refreshToken) {
            const { data: sessionData } = await supabase.auth.refreshSession({
              refresh_token: refreshToken,
            });

            if (sessionData?.session)
              await supabase.auth.setSession(sessionData?.session)
            // remove only refreshToken from url
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) { }

        getData();
      };

      const refreshToken = window.location.search.split('refreshToken=')[1]

      if (refreshToken) {
        loadSession()
      } else {
        getData();
      }
    } catch (error) {
      console.error((error as any)?.message)
    }
  }, [supabase])

  const getNameLetters = () => {
    if (profile?.name) {
      const name = profile?.name.split(' ')
      return name.length > 1 ? name[0][0] + name[1][0] : name[0][0]
    }

    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 rounded-full flex items-center space-x-4">
          <Avatar className="h-9 w-9 bg-neutral-700 data-[defaultAvatar=true]:p-2" data-defaultAvatar={!getNameLetters()}>
            <AvatarImage src={profile?.avatar || (!getNameLetters() && '/avatar-default.png')} alt="avatar" />
            <AvatarFallback>{getNameLetters()}</AvatarFallback>
          </Avatar>
          <div className="text-left ">
            <p className="text-sm text-muted-foreground">{'Autenticado como:'}</p>
            <p className="text-sm font-medium leading-none">{profile?.name || 'Convidado'}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      {/* <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">shadcn</p>
            <p className="text-xs leading-none text-muted-foreground">
              m@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent> */}
    </DropdownMenu>
  );
}
