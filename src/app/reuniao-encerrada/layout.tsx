import "../globals.css";

export const metadata = {
  title: "Reunião Encerrada - Meeting Mentorfy",
  description: "A reunião foi encerrada",
};

export default function ReuniaoEncerradaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
} 