"use client";
import { redirect } from "next/navigation";
import useCustomQueryString from "@/lib/web/use-custom-query-string";

export default function BaseBotPage() {
  const { pathname } = useCustomQueryString();
  // Check if pathname already ends with '/conversations'
  const shouldAppendConversations = !pathname.endsWith("/conversations");

  const newPath = shouldAppendConversations
    ? `${pathname}/conversations/all`
    : pathname;

  redirect(newPath);
}
