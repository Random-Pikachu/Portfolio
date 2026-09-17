import { useSyncExternalStore } from 'react';

/**
 * What the shell needs to know about where the reader is: the active sheet,
 * the active plate inside Details (or null), scroll progress for the rail,
 * and whether the tile index is open. Sections write, the shell reads. A
 * plain external store so nothing re-renders that does not subscribe.
 */
export interface SheetState {
  sheet: string;
  plate: number | null;
  progress: number;
  menu: boolean;
}

const SERVER: SheetState = { sheet: 'cover', plate: null, progress: 0, menu: false };
let state: SheetState = SERVER;
const listeners = new Set<() => void>();

export const sheetStore = {
  get: () => state,
  set(patch: Partial<SheetState>) {
    let changed = false;
    for (const k of Object.keys(patch) as (keyof SheetState)[]) {
      if (state[k] !== patch[k]) changed = true;
    }
    if (!changed) return;
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useSheetState(): SheetState {
  return useSyncExternalStore(sheetStore.subscribe, sheetStore.get, () => SERVER);
}
