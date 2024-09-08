export const URL =
  process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:5000"
    : "https://wiselydesk-python-baackend.onrender.com";

export const NEXTJS_BACKEND_URL =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://apps.wiselydesk.com";
