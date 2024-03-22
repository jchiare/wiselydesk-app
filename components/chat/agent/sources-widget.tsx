import Link from "next/link";
import getText from "@/lib/i18n/chat";
import React from "react";

const ZENDESK_SOURCE_ARTICLE_REGEX = "/[0-9]+-(.+)-?$";
const WEBPAGE_SOURCE_ARTICLE_REGEX = "/([^/]+)$";
const MAX_SOURCE_TEXT_LENGTH = 30;

function capitalizeFirstWord(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
    text = decodeURI(text).substring(0, MAX_SOURCE_TEXT_LENGTH);
    text = capitalizeFirstWord(text);
    return `${sourceIndex + 1}. ${text}`;
  }

  const webpageCaptureGroup = sourceUrl.match(
    WEBPAGE_SOURCE_ARTICLE_REGEX
  )?.[1];
  if (webpageCaptureGroup) {
    let text = webpageCaptureGroup.replaceAll("-", " ");
    text = decodeURI(text).substring(0, MAX_SOURCE_TEXT_LENGTH);
    text = capitalizeFirstWord(text);
    return `${sourceIndex + 1}. ${text}`;
  }

  return `Source ${sourceIndex + 1}`;
}

type SourcesProps = {
  sources: string[] | undefined;
  locale: "en" | "de";
  account: string;
  aiResponseDone: boolean;
};

export default function Sources({
  sources,
  locale,
  account,
  aiResponseDone
}: SourcesProps): JSX.Element | undefined {
  if (!sources || sources.length === 0 || !aiResponseDone) return;
  return (
    <div className="flex w-[90%] justify-end">
      <div className="w-fit rounded-lg bg-slate-600 px-3 pb-3 pt-1 text-[0.8rem] leading-5">
        <p style={{ marginTop: "0.25em", marginBottom: "0.25em" }}>
          {getText(account)["sources"][locale]}
        </p>
        {sources.map((source, index) => {
          return (
            <React.Fragment key={index}>
              <Link target="_blank" href={source}>
                {sourceText(source, index)}
              </Link>
              <br />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
