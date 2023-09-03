import { useRef, useEffect } from "react";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import getText from "@/i18n/chat";

export default function Input({
  onSubmit,
  setInput,
  input,
  chatTheme,
  aiResponseDone,
  account,
  locale
}: {
  onSubmit: () => void;
  setInput: (input: string) => void;
  input: string;
  chatTheme: ChatThemeSettings;
  aiResponseDone: boolean;
  account: string;
  locale: string;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function handleEnterBtn(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        // Add newline on Shift+Enter
        setInput(input + "\n");
      } else {
        // check if input is empty or only contains whitespace
        if (e.target.value.trim() === "") {
          return;
        }
        setInput(e.target.value);
        onSubmit();
      }
    }
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    // check if input is empty or only contains whitespace
    if (input.trim() === "") {
      return;
    }
    onSubmit();
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <label htmlFor="userQuestion">
      <div
        className={`absolute bottom-0 left-0 flex w-full justify-center border-t border-white/20 ${chatTheme.inputSetting.bgColour}  md:border-t-0  md:border-transparent`}>
        <form
          className="stretch mx-2 flex w-[80%] flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
          onSubmit={(e) => handleSubmit(e)}
          onKeyDown={(e) => handleEnterBtn(e)}>
          <div className="relative flex h-full flex-1 md:flex-col">
            <div
              className={`relative flex w-full flex-grow flex-col rounded-md border border-gray-900/50 bg-gray-700 py-[10px] text-white shadow-[0_0_15px_rgba(0,0,0,0.10)] md:p-4 ${
                !aiResponseDone && "cursor-not-allowed"
              }`}>
              <textarea
                id="userQuestion"
                tabIndex={1}
                value={input}
                ref={textAreaRef}
                placeholder={getText(account)["inputPlaceholder"][locale]}
                rows={1}
                disabled={!aiResponseDone}
                onChange={(e) => setInput(e.target.value)}
                className={`h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed md:pl-0`}></textarea>
              <button
                className={`absolute bottom-1.5 right-1 rounded-md p-1 text-gray-500 hover:bg-gray-900 hover:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent md:bottom-4 md:right-2`}
                onClick={(e) => handleSubmit(e)}
                disabled={!aiResponseDone}
                type="submit">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </label>
  );
}
