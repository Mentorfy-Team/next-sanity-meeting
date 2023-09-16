import '../globals.css'

export const metadata = {
  title: 'Meeting Mentorfy',
  description: 'Uma experiência de reuniões e mentorias de alto desempenho.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
