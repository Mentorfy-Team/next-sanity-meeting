import { ClerkProvider } from '@clerk/nextjs'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    {children}
    </ClerkProvider>
  );
}
