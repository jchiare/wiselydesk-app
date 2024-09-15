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

type Props = {
  isDebugVisible: boolean;
  modelVersion: string | null;
  responseTime: string | null;
  formattedMessages: { role: string; content: string }[] | null;
  userId: number;
};

export function AiDebugSection({
  isDebugVisible,
  modelVersion,
  responseTime,
  formattedMessages,
  userId
}: Props): JSX.Element {
  return (
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

            const shouldShowPrompt = userId == 5 || userId === 10;

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
                      <span
                        className={`block rounded bg-yellow-100 p-1 ${!shouldShowPrompt && "text-center"}`}>
                        {/* show prompt to WiselyDesk / Jay only */}
                        {shouldShowPrompt ? prettyPrompt : "Prompt Hidden"}
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
  );
}
