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
      return parts.join("/");
    },
    [pathname]
  );

  const changeFilter = useCallback(
    (newFilter: string) => {
      const parts = pathname.split("/");
      if (parts.length >= 5) {
        // Make sure the path has enough parts to contain the filter
        parts[4] = newFilter; // Assuming filter is at index 4
        return parts.join("/");
      }
      return pathname; // Return the original path if it doesn't have a filter
    },
    [pathname]
  );

  return {
    createQueryString,
    pathname,
    searchParams,
    getBotId,
    changeBotById,
    changeFilter
  };
};

export default useCustomQueryString;
