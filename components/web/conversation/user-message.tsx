import { formatDateTime } from "@/lib/utils";

export function UserMessage({
  sentTime,
  text,
  isLoading
}: {
  text: string | null;
  sentTime: Date | string;
  isLoading?: boolean;
}): JSX.Element {
  return (
    <div className="flex items-start justify-end">
      <div className="mx-2 my-1 max-w-[60%] first:my-2">
        <div className="rounded-lg border-2 border-blue-700 bg-blue-600 p-2 font-medium text-white opacity-80">
          <p className={isLoading ? "blur-sm" : ""}>{text}</p>
        </div>
        {/* <div className="mt-1 flex justify-end">
          <p className={`text-xs text-gray-400 ${isLoading ? "blur-sm" : ""}`}>
            {formatDateTime(sentTime)}
          </p>
        </div> */}
      </div>
    </div>
  );
}
