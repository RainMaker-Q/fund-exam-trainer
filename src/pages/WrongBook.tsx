import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { questions } from '../lib/curriculum';
import { clearWrongBook, loadWrongBook, removeWrongItem } from '../lib/storage';
import type { WrongItem } from '../types';

export default function WrongBook() {
  const [items, setItems] = useState<WrongItem[]>(() => loadWrongBook());

  const rows = useMemo(() => {
    const map = new Map(questions.map((q) => [q.id, q]));
    return items
      .map((it) => ({ item: it, question: map.get(it.questionId) }))
      .filter((x) => x.question);
  }, [items]);

  function refresh() {
    setItems(loadWrongBook());
  }

  function removeOne(id: string) {
    removeWrongItem(id);
    refresh();
  }

  function clearAll() {
    if (!window.confirm('确定清空全部错题吗？')) return;
    clearWrongBook();
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-800">错题本</h2>
        <p className="text-sm text-slate-500">答错自动收录，刷新后仍保留（localStorage）</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link
          to="/quiz/wrong"
          className={`flex min-h-11 items-center justify-center rounded-xl text-sm font-semibold text-white ${
            rows.length ? 'bg-amber-600 active:bg-amber-700' : 'pointer-events-none bg-slate-300'
          }`}
        >
          错题重练
        </Link>
        <button
          type="button"
          onClick={clearAll}
          disabled={!rows.length}
          className="flex min-h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 active:bg-slate-200 disabled:opacity-40"
        >
          清空全部
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-base text-slate-400">
          暂无错题，去做几道练习吧
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ item, question }) => (
            <li
              key={item.questionId}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs leading-5 text-slate-400">
                {new Date(item.timestamp).toLocaleString('zh-CN', {
                  timeZone: 'Asia/Shanghai',
                })}{' '}
                · 你的答案 {item.selected.join(',') || '—'} · 正解{' '}
                {question!.answer.join(',')}
              </div>
              <div className="mt-2 text-[15px] font-medium leading-6 text-slate-800">
                {question!.stem}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.pointCodes.map((c) => (
                  <Link
                    key={c}
                    to={`/point/${c}`}
                    className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-600 active:bg-indigo-100"
                  >
                    {c}
                  </Link>
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeOne(item.questionId)}
                className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700 active:bg-emerald-100"
              >
                已掌握，移除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
