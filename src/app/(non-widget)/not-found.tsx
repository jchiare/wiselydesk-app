import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>

      <p>
        You can contact support at{" "}
        <a href="mailto:support@wiselydesk.com" className="text-blue-500">
          support@wiselydesk.com
        </a>
      </p>
      <h3>
        <Link className="text-xl hover:text-blue-800" href="/">
          Or click here to return to homepage
        </Link>
      </h3>
    </div>
  );
}
