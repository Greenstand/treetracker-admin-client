import { useCallback, useEffect, useRef } from 'react';

export function useDebounce(callback, delay) {
  const timerRef = useRef(null);

  // useRef gives us a stable object whose .current we can mutate without
  // triggering a re-render. We seed it with the initial callback, then keep it
  // current via the effect below.
  const callbackRef = useRef(callback);

  // No dependency array — runs after every render so callbackRef.current always
  // holds the latest callback. This lets the debounced function (which closes
  // over the ref, not the callback directly) avoid stale closures without
  // needing callback in useCallback's dep array (which would recreate the
  // debounced function on every render and defeat debouncing).
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay]
  );
}
