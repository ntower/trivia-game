import { useRef, useEffect } from "react";

// Remembers a value from the previous render
export default function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
