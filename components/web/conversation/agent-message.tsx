import { formatConversationTime } from "@/lib/shared/utils";
import Link from "next/link";
import renderMessage from "@/lib/shared/services/render-message";
// import ThumbsUpDown from "@/components/ThumbsUpDown";

const ZENDESK_SOURCE_ARTICLE_REGEX = "/[0-9]+-(.+)-?$";
const WEBPAGE_SOURCE_ARTICLE_REGEX = "/([^/]+)$";
const MAX_SOURCE_TEXT_LENGTH = 30;

// converts urls as follows:
// - zendesk url example:
//    https://d3v-daspu.zendesk.com/hc/en-us/articles/13814641155985-Welcome-to-your-Help-Center-
//    -> "Welcome to your Help Center"
// - company webpage example:
//    https://www.amboss.com/us/usmle/study-for-step1
//    -> "Study for Step 1"
function sourceText(sourceUrl: string, sourceIndex: number): string {
  const zendeskCaptureGroup = sourceUrl.match(
    ZENDESK_SOURCE_ARTICLE_REGEX
  )?.[1];
  if (zendeskCaptureGroup) {
    let text = zendeskCaptureGroup.replaceAll("-", " ");
    text = decodeURI(text);
    if (text.length > MAX_SOURCE_TEXT_LENGTH)
      text = text.substring(0, MAX_SOURCE_TEXT_LENGTH);
    return `${sourceIndex + 1}. ${text}`;
  }

  const webpageCaptureGroup = sourceUrl.match(
    WEBPAGE_SOURCE_ARTICLE_REGEX
  )?.[1];
  if (webpageCaptureGroup) {
    let text = webpageCaptureGroup.replaceAll("-", " ");
    text = decodeURI(text);
    if (text.length > MAX_SOURCE_TEXT_LENGTH)
      text = text.substring(0, MAX_SOURCE_TEXT_LENGTH);
    return `${sourceIndex + 1}. ${text}`;
  }

  return `Source ${sourceIndex + 1}`;
}

function uniqueSourcesList(sources: string): Array<string> {
  return Array.from(new Set(sources?.split(", ")));
}

function thumbFill({
  direction,
  isHelpful
}: {
  direction: "up" | "down";
  isHelpful: boolean | null;
}): string {
  const isFilled =
    isHelpful != null &&
    ((direction === "up" && isHelpful) || (direction === "down" && !isHelpful));
  return isFilled ? "grey" : "none";
}

export default function AgentMessage({
  sentTime,
  text,
  sources,
  isHelpful,
  isFirstMessage
}: {
  text: string;
  sentTime: string;
  sources: string;
  isHelpful: boolean | null;
  isFirstMessage: boolean;
}): JSX.Element {
  sentTime = formatConversationTime(sentTime);

  return (
    <div className="flex items-end">
      <div className="mx-2 my-1 max-w-[60%]">
        <div className="rounded-lg bg-gray-600 p-2 font-medium text-white">
          <p dangerouslySetInnerHTML={{ __html: renderMessage(text) }}></p>
        </div>
        <div className="grid grid-cols-2 justify-start">
          <div className="mt-1 flex space-x-2">
            {/* {!isFirstMessage && (
              <>
                <ThumbsUpDown
                  direction="up"
                  fill={thumbFill({ direction: "up", isHelpful })}
                />
                <ThumbsUpDown
                  direction="down"
                  fill={thumbFill({ direction: "down", isHelpful })}
                />
              </>
            )} */}
          </div>
          <p className="text-end text-xs text-gray-400">{sentTime}</p>
        </div>
        {sources && (
          <div className="grid">
            <div>
              <p>Sources:</p>
              {uniqueSourcesList(sources).map((source, index) => {
                return (
                  <div key={`${source}${index}`}>
                    <Link
                      target="_blank"
                      key={`${source}${index}`}
                      href={source}
                      className="mr-2 text-sm font-semibold text-[#161651] hover:text-blue-700 hover:underline">
                      {sourceText(source, index)}
                    </Link>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
