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
          <p className="mb-1 text-sm text-gray-700">
            Analyze by time and viewing options
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
