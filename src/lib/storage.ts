import type { ProgressState, WrongItem } from '../types';

const PROGRESS_KEY = 'fund-exam-progress-v1';
const WRONG_KEY = 'fund-exam-wrong-v1';

const defaultProgress = (): ProgressState => ({
  answered: {},
  pointStats: {},
});

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
}

export function loadWrongBook(): WrongItem[] {
  try {
    const raw = localStorage.getItem(WRONG_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WrongItem[];
  } catch {
    return [];
  }
}

export function saveWrongBook(items: WrongItem[]) {
  localStorage.setItem(WRONG_KEY, JSON.stringify(items));
}

export function addWrongItem(item: WrongItem) {
  const list = loadWrongBook();
  const next = list.filter((x) => x.questionId !== item.questionId);
  next.unshift(item);
  saveWrongBook(next);
  return next;
}

export function removeWrongItem(questionId: string) {
  const next = loadWrongBook().filter((x) => x.questionId !== questionId);
  saveWrongBook(next);
  return next;
}

export function clearWrongBook() {
  saveWrongBook([]);
}
