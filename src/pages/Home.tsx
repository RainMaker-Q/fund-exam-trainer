import { Link } from 'react-router-dom';
import { curriculum, getAllPoints, questions } from '../lib/curriculum';
import { loadProgress, loadWrongBook } from '../lib/storage';

export default function Home() {
  const progress = loadProgress();
  const wrong = loadWrongBook();
  const answeredCount = Object.keys(progress.answered).length;
  const correctCount = Object.values(progress.answered).filter((x) => x.correct).length;
  const points = getAllPoints();
  const practicedPoints = Object.keys(progress.pointStats).length;

  const last = progress.lastQuiz;
  let continueTo = '/quiz/kemu1/random';
  let continueLabel = '随机练习科一';
  if (last?.mode === 'chapter' && last.subjectId && last.chapterId) {
    continueTo = `/quiz/${last.subjectId}/chapter/${last.chapterId}`;
    continueLabel = '继续章节练习';
  } else if (last?.mode === 'point' && last.pointId) {
    continueTo = `/quiz/point/${last.pointId}`;
    continueLabel = '继续考点练习';
  } else if (last?.mode === 'level' && last.subjectId) {
    continueTo = `/quiz/${last.subjectId}/level/掌握`;
    continueLabel = '继续掌握级练习';
  } else if (last?.mode === 'random' && last.subjectId) {
    continueTo = `/quiz/${last.subjectId}/random`;
    continueLabel = `继续随机练习${last.subjectId === 'kemu1' ? '科一' : '科二'}`;
  } else if (last?.mode === 'wrong') {
    continueTo = '/quiz/wrong';
    continueLabel = '继续错题重练';
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg">
        <h2 className="text-xl font-bold">基金从业考点训练</h2>
        <p className="mt-2 text-[15px] leading-6 text-indigo-100">
          覆盖 2026 大纲 · {curriculum.subjects.length} 科 · {points.length} 个考点 ·{' '}
          {questions.length} 道练习题
        </p>
        <p className="mt-3 inline-flex rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium">
          学习建议：先科一再科二
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="已答题" value={`${answeredCount}`} sub={`正确 ${correctCount}`} />
        <Stat label="练习考点" value={`${practicedPoints}`} sub={`共 ${points.length}`} />
        <Stat label="错题本" value={`${wrong.length}`} sub="自动收集错题" />
        <Stat
          label="正确率"
          value={answeredCount ? `${Math.round((correctCount / answeredCount) * 100)}%` : '—'}
          sub="基于本地记录"
        />
      </section>

      <section className="space-y-3">
        {curriculum.subjects.map((s) => {
          const pts = getAllPoints(s.id);
          const qs = questions.filter((q) => q.subjectId === s.id);
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800">{s.shortName}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.name}</p>
              <p className="mt-2 text-sm text-slate-600">
                {s.chapters.length} 章 · {pts.length} 考点 · {qs.length} 题
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2">
                <Link
                  to={`/overview/${s.id}`}
                  className="flex min-h-11 items-center justify-center rounded-xl bg-indigo-50 text-sm font-semibold text-indigo-700 active:bg-indigo-100"
                >
                  考点总览
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/quiz/${s.id}/level/掌握`}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-rose-50 text-sm font-semibold text-rose-700 active:bg-rose-100"
                  >
                    优先掌握
                  </Link>
                  <Link
                    to={`/quiz/${s.id}/random`}
                    className="flex min-h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 active:bg-slate-200"
                  >
                    随机练习
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        <Link
          to="/wrong"
          className="block rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm active:border-amber-300"
        >
          <h3 className="text-lg font-semibold text-amber-900">错题本</h3>
          <p className="mt-1 text-sm text-amber-800">答错自动收录，支持重练与移除</p>
          <p className="mt-3 text-3xl font-bold text-amber-700">{wrong.length}</p>
        </Link>

        <Link
          to={continueTo}
          className="block rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm active:border-emerald-300"
        >
          <h3 className="text-lg font-semibold text-emerald-900">继续练习</h3>
          <p className="mt-1 text-sm text-emerald-800">{continueLabel}</p>
          <p className="mt-3 text-sm font-medium text-emerald-700">从上次进度接着练 →</p>
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-400">{sub}</div>
    </div>
  );
}
