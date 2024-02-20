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

export async function getAPIServerSession(): Promise<any> {
  if (process?.env?.NODE_ENV === "development") {
    console.log("Getting Dev Session");
    return { user: { organization_id: "2" } };
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthenticated", { status: 401 });
    return session;
  } catch (e) {
    console.log("Error getting session", e);
    return { user: { organization_id: "2" } };
  }
}
