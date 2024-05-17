import { useRef, useEffect } from "react";
import type { ChatThemeSettings } from "@/lib/chat/chat-theme";
import getText from "@/lib/i18n/chat";

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
  locale: "en" | "de";
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
      <div className={`absolute bottom-0 left-0 flex w-full justify-center`}>
        <form
          className="stretch mx-1 mb-4 flex w-[90%] flex-row gap-3 lg:mx-auto lg:max-w-3xl lg:pt-6"
          onSubmit={e => handleSubmit(e)}
          onKeyDown={e => handleEnterBtn(e)}>
          <div className="relative flex h-full flex-1 md:flex-col">
            <div
              className={`relative flex w-full flex-grow flex-col items-center justify-center rounded-md border border-slate-900/50 bg-slate-600 py-[10px] text-white shadow-[0_0_15px_rgba(0,0,0,0.10)] md:p-4 ${
                !aiResponseDone && "cursor-not-allowed"
              }`}>
              <textarea
                id="userQuestion"
                tabIndex={1}
                autoFocus
                value={input}
                ref={textAreaRef}
                placeholder={getText(account)["inputPlaceholder"][locale]}
                rows={1}
                disabled={!aiResponseDone}
                onChange={e => setInput(e.target.value)}
                className={`h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed md:pl-0`}></textarea>
              <button
                aria-label="Input for Chat"
                className={`absolute right-2 rounded-md p-1 text-slate-500 hover:bg-slate-900 hover:text-slate-400 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                onClick={e => handleSubmit(e)}
                disabled={!aiResponseDone}
                type="submit">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="m-1 h-4 w-4"
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
