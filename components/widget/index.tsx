"use client";

function openWidget() {
  console.log("hello");
}

export function Widget(): JSX.Element {
  return (
    <button onClick={openWidget}>
      <div className="absolute bottom-0 top-0 flex w-full select-none items-center justify-center bg-slate-400 opacity-100">
        <svg
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="28"
          height="32"
          className="rounded-full bg-white">
          <path
            fill="#94A3B8"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 11.9 13 12.5 13 14h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path>
        </svg>
      </div>
    </button>
  );

  {
    /* <iframe
    src="https://apps.wiselydesk.com/chat/demo?client_api_key=hYn1picbsJfRm6vNUMOKv1ANYFSD4mZNTgsiw7LdHnE&model=gpt-3.5-turbo&create_support_ticket=true"
    name="wiselydesk-launcher"
    title="WiselyDesk Chat"
    role="dialog"
    className="h-16 w-16 rounded-full border shadow-lg" 
  /> */
  }
}
