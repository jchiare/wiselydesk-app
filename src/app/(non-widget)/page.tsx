import { redirect } from "next/navigation";

export default function BasePage() {
  redirect("/auth/signin");
}
