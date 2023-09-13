import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useRefreshPage(seconds: number) {
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    function startTimer() {
      timer = setInterval(() => {
        router.refresh();
      }, seconds * 1000);
    }

    startTimer();

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        clearInterval(timer);
      } else {
        startTimer();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, seconds]);
}
