import { AuthProvider } from "./Providers";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "sendflow",
  description: "Marketing website",
};

export default async function RootLayout({ children }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("getServerSession error in RootLayout", error);
  }


  return (
    <html lang="en">
   
      <body className={`${inter.className} min-h-screen bg-white text-slate-900 antialiased dark:bg-ink dark:text-textPrimary`}>
        <Navbar session={session}/>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
