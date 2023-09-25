import { formatConversationTime } from "@/lib/shared/utils";

export default function UserMessage({
  sentTime,
  text,
  isLoading
}: {
  text: string | null;
  sentTime: Date | string;
  isLoading?: boolean;
}): JSX.Element {
  sentTime = formatConversationTime(sentTime);

  return (
    <div className="flex items-start justify-end">
      <div className="mx-2 my-1 max-w-[60%] first:my-2">
        <div className="rounded-lg bg-blue-600 p-2 font-medium text-white">
          <p className={isLoading ? "blur-sm" : ""}>{text}</p>
        </div>
        <div className="mt-1 flex justify-end">
          <p className={`text-xs text-gray-400 ${isLoading ? "blur-sm" : ""}`}>
            {sentTime.toString()}
          </p>
        </div>
      </div>
    </div>
  );
}
