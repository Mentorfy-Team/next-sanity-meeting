import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Meeting",
  description: "Video Calling App",
  icons: "/icons/logo-icon.png",
};

const RootLayout = ({ children, ...rest }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <StreamVideoProvider {...rest}>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
