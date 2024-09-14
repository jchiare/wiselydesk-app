"use client";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import renderMessage from "@/lib/shared/services/render-message";
import ThumbsUpDown from "@/components/web/thumbs-up-down";
import { useState } from "react";

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

const PROMPT_END = "- Text: <article text>";
const CONTEXT_END = "Article title:";
function prettyAiDebugOutput(textOutput: string): {
  prettyPrompt: string;
  prettyContext: string[];
} {
  const splitOnPrompt = textOutput.split(PROMPT_END);
  const prettyPrompt = splitOnPrompt[0] + PROMPT_END;

  const prettyContext = splitOnPrompt[1]
    ?.split(CONTEXT_END)
    .slice(1)
    .map(item => `${CONTEXT_END}${item}`);

  return { prettyPrompt, prettyContext };
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

export function AgentMessage({
  sentTime,
  text,
  sources,
  isHelpful,
  isFirstMessage,
  isLoading,
  isFinished,
  modelVersion,
  formattedMessages,
  responseTime
}: {
  text: string | null;
  sentTime: Date | string;
  sources: string | null;
  isHelpful: boolean | null;
  isFirstMessage: boolean;
  isFinished: boolean;
  isLoading?: boolean;
  modelVersion: string | null;
  formattedMessages: { role: string; content: string }[] | null;
  responseTime: string | null;
}): JSX.Element {
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  const toggleDebug = () => {
    setIsDebugVisible(!isDebugVisible);
  };

  return (
    <div className="flex items-end">
      <div className="my-1 w-full">
        <div className="w-[65%]">
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
                Message did not finish - user likely closed browser window
                before AI finished responding
              </p>
            )}
          </div>
          <div className={`my-1 grid grid-cols-2 justify-start`}>
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
            {isFirstMessage && (
              <p
                className={`mt-1 text-right text-xs text-gray-400 ${
                  isLoading ? "blur-sm" : ""
                }`}>
                {formatDateTime(sentTime)}
              </p>
            )}
            {!isFirstMessage && (
              <button
                onClick={toggleDebug}
                className="text-end text-xs text-blue-500 hover:underline">
                AI Debug
              </button>
            )}
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

        {!isFirstMessage && (
          <div
            id="debug-section"
            className={`mt-2 rounded border bg-gray-100 p-4 text-sm shadow-md ${
              isDebugVisible ? "block" : "hidden"
            }`}>
            <h2 className="text-lg font-semibold text-gray-700">
              AI Debug Information
            </h2>
            <div className="mt-2">
              <p className="text-gray-600">
                <strong>Model Version:</strong> {modelVersion}
              </p>
              <p className="text-gray-600">
                <strong>Response Time:</strong> {responseTime}
              </p>
            </div>
            {formattedMessages && formattedMessages.length > 0 && (
              <div className="mt-2 whitespace-pre-wrap">
                <h3 className="text-base font-semibold text-gray-700">
                  AI messages input:
                </h3>
                {formattedMessages.map((message, index) => {
                  const { prettyPrompt, prettyContext } = prettyAiDebugOutput(
                    message.content
                  );

                  return (
                    <div
                      key={index + message.content.substring(0, 20)}
                      className="mt-1">
                      <p className="text-gray-600">
                        <strong>Role:</strong> {message.role}
                      </p>
                      <p className="leading-relaxed text-gray-600">
                        {message.role === "system" ? (
                          <>
                            <strong>Content:</strong>
                            <span className="block rounded bg-yellow-100 p-1">
                              {prettyPrompt}
                            </span>
                            {prettyContext.map((context, index) => (
                              <span
                                className="my-2 block rounded bg-blue-100 p-1"
                                key={index + context.slice(0, 15)}>
                                {context}
                              </span>
                            ))}
                          </>
                        ) : (
                          <>
                            <strong>Content:</strong> {message.content}
                          </>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
