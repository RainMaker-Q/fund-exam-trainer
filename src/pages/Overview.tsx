import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LevelBadge from '../components/LevelBadge';
import { getSubject, questions } from '../lib/curriculum';
import type { Level } from '../types';

const LEVELS: Array<Level | '全部'> = ['全部', '掌握', '理解', '了解'];

export default function Overview() {
  const { subjectId = 'kemu1' } = useParams();
  const subject = getSubject(subjectId);
  const [level, setLevel] = useState<Level | '全部'>('全部');
  const [q, setQ] = useState('');
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    if (!subject) return [];
    const keyword = q.trim().toLowerCase();
    return subject.chapters
      .map((ch) => ({
        ...ch,
        sections: ch.sections
          .map((sec) => ({
            ...sec,
            points: sec.points.filter((p) => {
              if (level !== '全部' && p.level !== level) return false;
              if (!keyword) return true;
              return (
                p.title.toLowerCase().includes(keyword) ||
                p.code.toLowerCase().includes(keyword) ||
                p.id.toLowerCase().includes(keyword)
              );
            }),
          }))
          .filter((sec) => sec.points.length > 0),
      }))
      .filter((ch) => ch.sections.length > 0);
  }, [subject, level, q]);

  function isOpen(id: string) {
    if (openChapters[id] !== undefined) return openChapters[id];
    if (q.trim() || level !== '全部') return true;
    return filtered[0]?.id === id;
  }

  function toggleChapter(id: string) {
    setOpenChapters((prev) => ({ ...prev, [id]: !isOpen(id) }));
  }

  if (!subject) {
    return <div className="text-base text-slate-500">未找到科目</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">{subject.shortName} · 考点总览</h2>
        <p className="text-sm text-slate-500">{subject.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          to={`/quiz/${subject.id}/level/掌握`}
          className="flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-3 text-sm font-semibold text-white active:bg-rose-700"
        >
          优先练掌握
        </Link>
        <Link
          to={`/quiz/${subject.id}/random`}
          className="flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white active:bg-indigo-700"
        >
          随机练习
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索考点标题 / 编号…"
          className="w-full min-h-11 rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-indigo-400"
        />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-400">掌握程度</span>
          <div className="grid grid-cols-4 gap-2">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setLevel(lv)}
                className={`min-h-10 rounded-xl text-sm font-medium active:scale-95 ${
                  level === lv
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 active:bg-slate-200'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((ch) => {
          const chCount = questions.filter((x) => x.chapterId === ch.id).length;
          const open = isOpen(ch.id);
          return (
            <section
              key={ch.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleChapter(ch.id)}
                className="flex w-full min-h-14 items-center justify-between gap-2 bg-slate-50 px-4 py-3 text-left active:bg-slate-100"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800">{ch.name}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{chCount} 题</div>
                </div>
                <span
                  className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  ▼
                </span>
              </button>
              {open && (
                <>
                  <div className="border-t border-slate-100 px-4 py-3">
                    <Link
                      to={`/quiz/${subject.id}/chapter/${ch.id}`}
                      className="flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-indigo-700 active:bg-indigo-100"
                    >
                      按章练习
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100 border-t border-slate-100">
                    {ch.sections.map((sec) => (
                      <div key={sec.id} className="px-3 py-3">
                        <h3 className="mb-2 px-1 text-sm font-medium text-slate-600">
                          {sec.name}
                        </h3>
                        <ul className="space-y-1">
                          {sec.points.map((p) => (
                            <li key={p.id}>
                              <Link
                                to={`/point/${p.id}`}
                                className="flex min-h-12 items-start gap-2 rounded-xl px-2 py-2.5 active:bg-slate-50"
                              >
                                <LevelBadge level={p.level} />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs text-slate-400">{p.code}</div>
                                  <div className="text-[15px] leading-snug text-slate-800">
                                    {p.title}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
            没有匹配的考点
          </div>
        )}
      </div>
    </div>
  );
}
