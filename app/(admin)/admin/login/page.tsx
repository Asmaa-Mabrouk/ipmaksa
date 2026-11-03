import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await getSession()) redirect("/admin"); // already signed in
  return <LoginForm />;
}
