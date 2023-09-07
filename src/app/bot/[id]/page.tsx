"use client";
import { redirect } from "next/navigation";
import useCustomQueryString from "@/lib/bot/use-custom-query-string";

export default function BaseBotPage() {
  const { pathname } = useCustomQueryString();
  redirect(`${pathname}/conversations`);
}
