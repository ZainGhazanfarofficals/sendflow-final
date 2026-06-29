import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Login() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("getServerSession error on login", error);
  }
  if (session) redirect("/dashboard");

  return <LoginForm />;
}
