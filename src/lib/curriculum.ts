import curriculumData from '../data/curriculum.json';
import explanationsData from '../data/explanations.json';
import questionsData from '../data/questions.json';
import type { Curriculum, Point, Question, Subject, Level } from '../types';

export const curriculum = curriculumData as Curriculum;
export const explanations = explanationsData as Record<string, string>;
export const questions = questionsData as Question[];

export function getSubject(subjectId: string): Subject | undefined {
  return curriculum.subjects.find((s) => s.id === subjectId);
}

export function getAllPoints(subjectId?: string): Point[] {
  const subjects = subjectId
    ? curriculum.subjects.filter((s) => s.id === subjectId)
    : curriculum.subjects;
  const points: Point[] = [];
  for (const s of subjects) {
    for (const ch of s.chapters) {
      for (const sec of ch.sections) {
        points.push(...sec.points);
      }
    }
  }
  return points;
}

export function getPoint(pointId: string): Point | undefined {
  return getAllPoints().find((p) => p.id === pointId);
}

export function getPointMeta(pointId: string) {
  for (const s of curriculum.subjects) {
    for (const ch of s.chapters) {
      for (const sec of ch.sections) {
        const point = sec.points.find((p) => p.id === pointId);
        if (point) {
          return { subject: s, chapter: ch, section: sec, point };
        }
      }
    }
  }
  return undefined;
}

export function getQuestionsByFilter(opts: {
  subjectId?: string;
  chapterId?: string;
  pointId?: string;
  level?: Level | string;
  questionIds?: string[];
}): Question[] {
  let list = [...questions];
  if (opts.questionIds) {
    const set = new Set(opts.questionIds);
    list = list.filter((q) => set.has(q.id));
  }
  if (opts.subjectId) list = list.filter((q) => q.subjectId === opts.subjectId);
  if (opts.chapterId) list = list.filter((q) => q.chapterId === opts.chapterId);
  if (opts.pointId) {
    list = list.filter((q) => q.pointCodes.includes(opts.pointId!));
  }
  if (opts.level) {
    const levelPoints = new Set(
      getAllPoints(opts.subjectId)
        .filter((p) => p.level === opts.level)
        .map((p) => p.id),
    );
    list = list.filter((q) => q.pointCodes.some((c) => levelPoints.has(c)));
  }
  return list;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const levelColor: Record<string, string> = {
  掌握: 'bg-rose-100 text-rose-700 border-rose-200',
  理解: 'bg-amber-100 text-amber-700 border-amber-200',
  了解: 'bg-sky-100 text-sky-700 border-sky-200',
};
