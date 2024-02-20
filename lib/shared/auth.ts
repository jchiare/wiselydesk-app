import { authOptions } from "@/lib/web/next-auth-hack";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function fetchServerSession() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  return session;
}

export async function fetchServerSessionSignIn() {
  const session = await getServerSession(authOptions);
  if (session) return redirect("/bot");
}

export async function getEnvAwareServerSession(): Promise<any> {
  console.log("before before");
  if (process?.env?.NODE_ENV === "development") {
    console.log("Getting Dev Session");
    return { user: { organization_id: "2" } };
  }

  console.log("Getting Prod Session");
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/auth/signin");
  return session;
}
