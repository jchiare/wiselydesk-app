"use client";
import React, { useState } from "react";
import { NEXTJS_BACKEND_URL } from "@/lib/shared/constants";
import { useLocalStorage } from "@/lib/chat/hooks/use-local-storage";
import { getChatThemeByBotId } from "@/lib/chat/chat-theme";
import { textByBotId } from "@/lib/i18n/chat";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type SupportTicketModalProps = {
  conversationId: string | undefined;
  botId: number;
  locale?: string;
};

export default function SupportTicketModal({
  conversationId,
  botId,
  locale
}: SupportTicketModalProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [additionalInfo, setAdditionalInfo] = useLocalStorage<string>(
    "savedAdditionalInfo",
    ""
  );
  const [email, setEmail] = useLocalStorage<string>("savedEmail", "");
  const [name, setName] = useLocalStorage<string>("savedName", "");
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketCreated, setTicketCreated] = useState(false);
  const [contactReason, setContactReason] = useState<string | null>(null);

  function handleClick() {
    setIsModalOpen(true);
    if (conversationId) {
      if (!transcript) {
        fetch(
          `${NEXTJS_BACKEND_URL}/api/conversation/${conversationId}/transcribe`
        )
          .then(res => res.json())
          .then(data => {
            setTranscript(data["transcription"]);
          });
      }
    } else {
      throw new Error("No Conversation ID ... cant get summarization");
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  async function submitButton() {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const formData = {
      email,
      transcript,
      additionalInfo,
      locale,
      name,
      contactReason
    };

    try {
      const response = await fetch(
        `${NEXTJS_BACKEND_URL}/api/bot/${botId}/conversation/${conversationId}/submit-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        console.log("Ticket submitted successfully");
        setSubmitSuccess(true);
        setTimeout(() => {
          closeModal();
          setSubmitSuccess(false);
          localStorage.removeItem("savedAdditionalInfo");
          setTicketCreated(true);
          setAdditionalInfo("");
        }, 1700);
      } else {
        console.error("Failed to submit ticket");
        window.alert("Sorry - Error submitting support ticket");
        // Handle errors, maybe show an error message to the user
      }
    } catch (error) {
      console.error("There was an error submitting the ticket:", error);
      window.alert("Sorry - Error submitting support ticket");
      // Handle the error, maybe show an error message to the user
    } finally {
      setIsLoading(false);
    }
  }

  const { supportTicketSetting } = getChatThemeByBotId(botId);
  const texti18 = textByBotId(botId);

  type LocaleType = "en" | "de";
  const adjustedLocale: LocaleType = locale === "de" ? "de" : "en";

  return (
    <div className="relative">
      <button
        aria-label="Create Support Ticket"
        onClick={handleClick}
        disabled={ticketCreated}
        className={`rounded ${
          ticketCreated
            ? supportTicketSetting.chatButtonCreated
            : supportTicketSetting.chatButton
        } px-4 py-2 font-bold text-white transition-colors duration-300 `}>
        {ticketCreated
          ? texti18.supportTicketModal.createdButton[adjustedLocale]
          : texti18.supportTicketModal.createButton[adjustedLocale]}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-70"
            onClick={closeModal}></div>

          <div className="relative z-10 flex h-fit max-w-[1/3] flex-col rounded bg-white p-7 text-gray-800 shadow-lg">
            <label className="mb-2 block ">
              <span className="pl-1">
                {texti18.supportTicketModal.name[adjustedLocale]}:
              </span>
              <input
                type="input"
                autoFocus={name.length === 0}
                name="name"
                value={name}
                className="mt-1 w-full rounded border p-2"
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label className="mb-2 block ">
              <span className="pl-1">
                {texti18.supportTicketModal.email[adjustedLocale]}:
              </span>
              <input
                type="email"
                autoFocus={name.length > 0 && email.length === 0}
                name="email"
                value={email}
                required
                className="mt-1 w-full rounded border p-2"
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <label className="mb-2 flex flex-col">
              <span className="pl-1">
                {texti18.supportTicketModal.info[adjustedLocale]}:
              </span>
              <textarea
                name="additional-info"
                value={additionalInfo}
                autoFocus={name.length > 0 && email.length > 0}
                rows={3}
                placeholder={
                  texti18.supportTicketModal.additionalInfo[adjustedLocale]
                }
                className="mt-1 w-full rounded border p-2"
                onChange={e => setAdditionalInfo(e.target.value)}
              />
            </label>
            <div className="flex items-center justify-around pt-3">
              <div>
                <Select onValueChange={value => setContactReason(value)}>
                  <SelectTrigger className="w-[180px] bg-slate-100">
                    <SelectValue
                      placeholder={`${texti18.supportTicketModal.contactReason[adjustedLocale]}?`}
                    />
                  </SelectTrigger>
                  <SelectContent className="m-2 bg-slate-100">
                    <SelectGroup>
                      <SelectItem
                        className="p-2 hover:cursor-pointer hover:bg-slate-200"
                        value="missing_information">
                        {
                          texti18.supportTicketModal.missingInformation[
                            adjustedLocale
                          ]
                        }
                      </SelectItem>
                      <SelectItem
                        className="p-2 hover:cursor-pointer hover:bg-slate-200"
                        value="AI_could_not_solve">
                        {
                          texti18.supportTicketModal.aiCouldnotSolve[
                            adjustedLocale
                          ]
                        }
                      </SelectItem>
                      <SelectItem
                        className="p-2 hover:cursor-pointer hover:bg-slate-200"
                        value="other">
                        {texti18.supportTicketModal.other[adjustedLocale]}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <button
                onClick={submitButton}
                disabled={isLoading || submitSuccess}
                className={` w-fit rounded px-4 py-2 font-bold text-white transition-colors duration-300 ${
                  submitSuccess
                    ? supportTicketSetting.submitButtonSuccess
                    : supportTicketSetting.submitButton
                }`}>
                {submitSuccess ? (
                  <span className="flex items-center">
                    <svg
                      className="-ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true">
                      <path d="M20.285 2l-11.285 11.567-5.286-4.745-3.714 4.161 9 8.017 15-15.426-4.715-3.574z" />
                    </svg>
                    {texti18.supportTicketModal.success[adjustedLocale]}
                  </span>
                ) : isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.002 7.938l1.272-1.272-.536-.375z"></path>
                    </svg>
                    {texti18.supportTicketModal.creating[adjustedLocale]}
                  </span>
                ) : (
                  <span>
                    {texti18.supportTicketModal.submitButton[adjustedLocale]}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isValidEmail(email: string) {
  const regex = /^[^@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email) && /[a-zA-Z]/.test(email);
}
