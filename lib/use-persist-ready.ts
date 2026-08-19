"use client";

import { useEffect, useState } from "react";

type PersistApi = {
  rehydrate: () => Promise<unknown> | unknown;
  hasHydrated: () => boolean;
  onFinishHydration: (cb: () => void) => () => void;
};

export function usePersistReady(persist: PersistApi) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    if (persist.hasHydrated()) {
      done();
      return;
    }
    const unsub = persist.onFinishHydration(done);
    void persist.rehydrate();
    return unsub;
  }, [persist]);
  return ready;
}
