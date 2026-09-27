import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { UserProvider } from "@/app/contexts/UserContext";
import SelectUser from "@/components/User";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Plataforma De Música",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <UserProvider>

          <SelectUser />
          {children}
          
        </UserProvider>
      </body>
    </html>
  );
}
