import Analytics from "@/components/web/analytics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | WiselyDesk",
  description: "View Analytics for WiselyDesk"
};

export default async function AnalyticsLayout({ children }: { children: any }) {
  return (
    <div className="p-4 sm:p-6 lg:px-16 lg:py-10 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View analytics about your conversations.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
