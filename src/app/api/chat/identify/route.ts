import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const WISELYDESK_FINGERPRINT = "wiselydesk_visitor_fingerprint";

export async function GET(request: NextRequest, response: NextResponse) {
  console.log(request.cookies.getAll());
  const cookieStore = cookies();
  const visitorFingerprint = cookieStore.get(WISELYDESK_FINGERPRINT);

  console.log(cookieStore.getAll());
  if (visitorFingerprint) {
    cookieStore.set(WISELYDESK_FINGERPRINT, "leeaaa", {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true
    });
    return NextResponse.json({ message: "!" });
  }

  const res = NextResponse.json(
    {
      message: "Login successful",
      success: true
    },
    {
      headers: {
        "Set-Cookie": "wiselydesk_visitor_fingerprint=lee"
      }
    }
  );

  res.cookies.set(WISELYDESK_FINGERPRINT, "lee");

  return res;
}
