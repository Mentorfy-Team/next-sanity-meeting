import { StreamTheme } from "@stream-io/video-react-sdk";
import "../../globals.css";
import { TrpcProvider } from "@/utils/trpc-provider";

export const metadata = {
  title: "Meeting Mentorfy",
  description: "Uma experiência de reuniões e mentorias de alto desempenho.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className="min-w-max h-[100dvh] flex flex-col">
      <TrpcProvider>
          <main className="flex-1">{children}</main>
        </TrpcProvider>
      </body>
    </html>
  );
}
