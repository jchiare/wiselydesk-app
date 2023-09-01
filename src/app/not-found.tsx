export default function Custom404() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>

      <p>
        Contact support at{" "}
        <a href="mailto:support@wiselydesk.com" className="text-blue-500">
          support@wiselydesk.com
        </a>{" "}
        and let us know what you were doing so we can resolve this!
      </p>
    </div>
  );
}
