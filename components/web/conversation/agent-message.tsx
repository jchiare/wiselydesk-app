import { formatDateTime } from "@/lib/shared/utils";
import Link from "next/link";
import renderMessage from "@/lib/shared/services/render-message";
import ThumbsUpDown from "@/components/web/thumbs-up-down";

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
  isFirstMessage,
  isLoading,
  isFinished
}: {
  text: string | null;
  sentTime: Date | string;
  sources: string | null;
  isHelpful: boolean | null;
  isFirstMessage: boolean;
  isFinished: boolean;
  isLoading?: boolean;
}): JSX.Element {
  return (
    <div className="flex items-end">
      <div className="mx-2 my-1 max-w-[60%]">
        <div
          className={`rounded-lg border-2 ${
            isFinished
              ? "border-gray-700 bg-gray-600"
              : "border-red-800 bg-red-600 opacity-80"
          } p-2 font-medium text-white`}>
          {isLoading ? (
            <p
              className="blur-sm"
              // @ts-expect-error some htmlthing
              dangerouslySetInnerHTML={{ __html: renderMessage(text) }}></p>
          ) : isFinished ? (
            <p
              // @ts-expect-error some htmlthing
              dangerouslySetInnerHTML={{ __html: renderMessage(text) }}></p>
          ) : (
            <p>
              Message did not finish - user likely closed browser window before
              AI finished responding
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 justify-start">
          <div className="mt-1 flex space-x-2">
            {!isFirstMessage && (
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
            )}
          </div>
          <p
            className={`mt-1 text-end text-xs text-gray-400 ${
              isLoading ? "blur-sm" : ""
            }`}>
            {formatDateTime(sentTime)}
          </p>
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
                      className={`mr-2 text-sm font-semibold text-[#161651] hover:text-blue-700 hover:underline ${
                        isLoading ? "blur-sm" : ""
                      }`}>
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
