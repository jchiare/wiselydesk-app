"use server";

import { cookies } from "next/headers";

const WISELYDESK_FINGERPRINT = "wiselydesk_visitor_fingerprint";

export async function identifyVisitor() {
  const visitorFingerprint = cookies().get(WISELYDESK_FINGERPRINT);
  if (!visitorFingerprint) {
    cookies().set(WISELYDESK_FINGERPRINT, "lee", {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      maxAge: 86400 * 30 // Max age set to 30 days
    });
  }
}
