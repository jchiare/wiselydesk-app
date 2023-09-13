export const URL =
  process.env.NODE_ENV === "development"
    ? "http://0.0.0.0:5000"
    : "https://wiselydesk-python-baackend.onrender.com";

export const NEXTJS_BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3002"
    : "https://apps.wiselydesk.com";
