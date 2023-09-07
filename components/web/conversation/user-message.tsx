import { formatConversationTime } from "@/lib/shared/utils";

export default function UserMessage({
  sentTime,
  text
}: {
  text: string;
  sentTime: string;
}): JSX.Element {
  sentTime = formatConversationTime(sentTime);

  return (
    <div className="flex items-start justify-end">
      <div className="mx-2 my-1 max-w-[60%] first:my-2">
        <div className="rounded-lg bg-blue-600 p-2 font-medium text-white">
          <p className="">{text}</p>
        </div>
        <div className="mt-1 flex justify-end">
          <p className="text-xs text-gray-400">{sentTime}</p>
        </div>
      </div>
    </div>
  );
}
