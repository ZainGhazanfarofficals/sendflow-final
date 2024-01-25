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

const contentStyle = {
  marginLeft: '250px', // Should match the width of the sidebar
  padding: '16px',
};

export default async function RootLayout({ children }) {
  
      const session = await getServerSession(authOptions);

  
  return (
    <html lang="en">
   
      <body  className={inter.className}>
        <Navbar session={session}/>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
