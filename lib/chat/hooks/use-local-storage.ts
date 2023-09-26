import React, { useState, useEffect } from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export function useLocalStorage<T>(
  storageKey: string,
  fallbackState: T
): [T, SetState<T>] {
  // Initialize state with the value in local storage or a fallback
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue !== null ? JSON.parse(storedValue) : fallbackState;
  });

  // Update local storage when the state changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
