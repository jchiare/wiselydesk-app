"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">Error - Something went wrong</h1>

      <p>
        Contact support at{" "}
        <a href="mailto:support@wiselydesk.com" className="text-blue-500">
          support@wiselydesk.com
        </a>{" "}
        and let us know what you were doing so we can resolve this!
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }>
        Try again
      </button>
    </div>
  );
}
