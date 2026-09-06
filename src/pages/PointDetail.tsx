import { Link, useParams } from 'react-router-dom';
import LevelBadge from '../components/LevelBadge';
import { explanations, getPointMeta, getQuestionsByFilter } from '../lib/curriculum';

export default function PointDetail() {
  const { pointId = '' } = useParams();
  const meta = getPointMeta(pointId);
  if (!meta) {
    return <div className="text-base text-slate-500">未找到考点</div>;
  }
  const { subject, chapter, section, point } = meta;
  const tip = explanations[point.id] || '暂无讲解，请结合大纲与教材复习。';
  const related = getQuestionsByFilter({ pointId: point.id });

  return (
    <div className="space-y-4">
      <div className="text-sm leading-6 text-slate-500">
        <Link to={`/overview/${subject.id}`} className="text-indigo-600 active:opacity-70">
          {subject.shortName}
        </Link>
        <span className="mx-1">/</span>
        <span>{chapter.name}</span>
        <span className="mx-1">/</span>
        <span>{section.name}</span>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={point.level} />
          <span className="text-xs text-slate-400">{point.id}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold leading-snug text-slate-800">{point.title}</h2>
        <div className="mt-4 rounded-xl bg-indigo-50 p-4 text-[15px] leading-7 text-slate-700">
          <div className="mb-1 text-xs font-semibold text-indigo-600">考点速记</div>
          {tip}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            to={`/quiz/point/${point.id}`}
            className="flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 text-base font-semibold text-white active:bg-indigo-700"
          >
            练习本考点（{related.length} 题）
          </Link>
          <Link
            to={`/quiz/${subject.id}/chapter/${chapter.id}`}
            className="flex min-h-12 items-center justify-center rounded-xl bg-slate-100 text-base font-semibold text-slate-700 active:bg-slate-200"
          >
            练习本章
          </Link>
        </div>
        {related.length === 0 && (
          <p className="mt-3 text-sm text-amber-600">
            本考点暂无专属题目，可先学习讲解，或练习同章其他题目。
          </p>
        )}
      </section>
    </div>
  );
}
