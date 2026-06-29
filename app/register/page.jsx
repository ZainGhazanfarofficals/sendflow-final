import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Register() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("getServerSession error on register", error);
  }

  if (session) redirect("/dashboard");

  return <RegisterForm />;
}
