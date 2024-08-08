import "../globals.css";
import Link from "next/link";
import { getPages } from "@/sanity/sanity-utils";
import { TrpcProvider } from "@/utils/trpc-provider";
import { NavigationMenuDemo } from "@/components/templates/Header";

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
        <body className="min-w-max">
          <TrpcProvider>
            <NavigationMenuDemo />
            {/* <header className="flex items-center justify-between">
            <Link href="/" className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent text-lg font-bold">Kapehe</Link>
            <div className="flex items-center gap-5 text-sm text-gray-600">
              {pages.map((page) => (
                <Link key={page._id} href={`/${page.slug}`} className="hover:underline">{page.title}</Link>
              ))}

            </div>

          </header> */}
            <main className="py-16">{children}</main>
          </TrpcProvider>
        </body>
      </html>
  );
}
