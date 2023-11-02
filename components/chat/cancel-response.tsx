import getText from "@/i18n/chat";

type CancelResponseProps = {
  aiResponseDone: boolean;
  setAiResponseDone: (arg: boolean) => void;
  locale: "en" | "de";
  account: string;
};

export default function CancelResponse({
  aiResponseDone,
  setAiResponseDone,
  locale,
  account
}: CancelResponseProps): JSX.Element | null {
  const handleCancelClick = () => {
    setAiResponseDone(true);
  };

  if (aiResponseDone) return null;

  return (
    <div className="flex justify-center bg-[#343541]">
      <button
        aria-label="Cancel Response"
        className="absolute z-[1] mt-[-90px] w-fit rounded bg-[#282934] p-3 text-white md:mt-[-120px]"
        onClick={handleCancelClick}>
        {getText(account)["cancelButton"][locale]}
      </button>
    </div>
  );
}
