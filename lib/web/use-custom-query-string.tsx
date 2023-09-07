import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const useCustomQueryString = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const getBotId = useCallback(() => {
    const parts = pathname.split("/");
    const id = parts[2];
    return id;
  }, [pathname]);

  const changeBotById = useCallback(
    (newBotId: number) => {
      const parts = pathname.split("/");
      parts[2] = newBotId.toString(); // Assuming bot ID is at index 2 in the pathname
      const newPath = parts.slice(0, 3).join("/");
      return newPath;
    },
    [pathname]
  );

  return { createQueryString, pathname, searchParams, getBotId, changeBotById };
};

export default useCustomQueryString;
