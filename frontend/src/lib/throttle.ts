export interface Throttled<T extends unknown[]> {
  (...args: T): void;
  cancel: () => void;
}

export const throttle = <T extends unknown[]>(
  fn: (...args: T) => void,
  wait: number,
): Throttled<T> => {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: T | null = null;

  const throttled = ((...args: T) => {
    const remaining = wait - (Date.now() - lastCall);

    if (remaining <= 0) {
      lastCall = Date.now();
      fn(...args);
      return;
    }

    pendingArgs = args;
    if (timeoutId) return;

    timeoutId = setTimeout(() => {
      lastCall = Date.now();
      timeoutId = null;
      if (pendingArgs) {
        const latestArgs = pendingArgs;
        pendingArgs = null;
        fn(...latestArgs);
      }
    }, remaining);
  }) as Throttled<T>;

  throttled.cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
    pendingArgs = null;
  };

  return throttled;
};
