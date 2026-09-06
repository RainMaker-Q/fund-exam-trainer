import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import {
  getQuestionsByFilter,
  getSubject,
  questions as allQuestions,
  shuffle,
} from '../lib/curriculum';
import {
  addWrongItem,
  loadProgress,
  loadWrongBook,
  removeWrongItem,
  saveProgress,
} from '../lib/storage';
import type { Question, QuizMode } from '../types';

function arraysEqual(a: string[], b: string[]) {
  const sa = [...a].sort().join(',');
  const sb = [...b].sort().join(',');
  return sa === sb;
}

export default function Quiz() {
  const params = useParams();
  const subjectId = params.subjectId;
  const chapterId = params.chapterId;
  const pointId = params.pointId;
  const level = params.level ? decodeURIComponent(params.level) : undefined;
  const location = useLocation();
  const isWrong =
    location.pathname.endsWith('/quiz/wrong') ||
    location.pathname.includes('/quiz/wrong');

  const mode: QuizMode = isWrong
    ? 'wrong'
    : pointId
      ? 'point'
      : chapterId
        ? 'chapter'
        : level
          ? 'level'
          : 'random';

  const pool = useMemo(() => {
    if (mode === 'wrong') {
      const ids = loadWrongBook().map((w) => w.questionId);
      return shuffle(getQuestionsByFilter({ questionIds: ids }));
    }
    if (mode === 'point' && pointId) {
      return shuffle(getQuestionsByFilter({ pointId }));
    }
    if (mode === 'chapter' && chapterId) {
      return shuffle(getQuestionsByFilter({ subjectId, chapterId }));
    }
    if (mode === 'level' && level) {
      let list = getQuestionsByFilter({ subjectId, level });
      if (list.length === 0 && subjectId) {
        list = allQuestions.filter((q) => q.subjectId === subjectId);
      }
      return shuffle(list);
    }
    return shuffle(getQuestionsByFilter({ subjectId }));
  }, [mode, subjectId, chapterId, pointId, level]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSelected([]);
    setSubmitted(false);
    setScore({ correct: 0, total: 0 });
    setFinished(false);
    const progress = loadProgress();
    progress.lastQuiz = {
      mode,
      subjectId,
      chapterId,
      pointId,
      level,
    };
    saveProgress(progress);
  }, [mode, subjectId, chapterId, pointId, level]);

  const question: Question | undefined = pool[index];
  const subject = subjectId ? getSubject(subjectId) : undefined;

  const title = useMemo(() => {
    if (mode === 'wrong') return '错题重练';
    if (mode === 'point') return '考点练习';
    if (mode === 'chapter') return '章节练习';
    if (mode === 'level') return `${level || ''}级练习`;
    return `${subject?.shortName || ''}随机练习`;
  }, [mode, level, subject]);

  function toggleOption(id: string) {
    if (submitted || !question) return;
    if (question.type === 'single') {
      setSelected([id]);
      return;
    }
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function submit() {
    if (!question || selected.length === 0 || submitted) return;
    const ok = arraysEqual(selected, question.answer);
    setSubmitted(true);
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));

    const progress = loadProgress();
    progress.answered[question.id] = { correct: ok, at: Date.now() };
    for (const pc of question.pointCodes) {
      const st = progress.pointStats[pc] || { correct: 0, wrong: 0 };
      if (ok) st.correct += 1;
      else st.wrong += 1;
      progress.pointStats[pc] = st;
    }
    saveProgress(progress);

    if (!ok) {
      addWrongItem({
        questionId: question.id,
        selected: [...selected],
        timestamp: Date.now(),
        pointCodes: question.pointCodes,
      });
    } else if (mode === 'wrong') {
      removeWrongItem(question.id);
    }
  }

  function next() {
    if (index + 1 >= pool.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setSubmitted(false);
  }

  if (pool.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-base text-slate-500">当前筛选下暂无题目</p>
        <Link
          to="/"
          className="mt-4 inline-flex min-h-11 items-center text-base text-indigo-600 active:opacity-70"
        >
          返回首页
        </Link>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score.correct / Math.max(score.total, 1)) * 100);
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">本轮结束</h2>
        <p className="mt-3 text-base text-slate-600">
          答对 {score.correct} / {score.total}，正确率 {pct}%
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-base font-medium text-white active:bg-indigo-700"
            onClick={() => {
              setIndex(0);
              setSelected([]);
              setSubmitted(false);
              setScore({ correct: 0, total: 0 });
              setFinished(false);
            }}
          >
            再练一轮
          </button>
          <Link
            to="/wrong"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-100 text-base font-medium text-amber-800 active:bg-amber-200"
          >
            查看错题本
          </Link>
          <Link
            to="/"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-100 text-base font-medium text-slate-700 active:bg-slate-200"
          >
            回首页
          </Link>
        </div>
      </div>
    );
  }

  const isCorrect = submitted && arraysEqual(selected, question!.answer);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <span className="shrink-0 text-sm text-slate-500">
          {score.correct}/{score.total}
        </span>
      </div>
      <ProgressBar current={index + (submitted ? 1 : 0)} total={pool.length} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-slate-100 px-2 py-1">
            {question!.type === 'single' ? '单选题' : '多选题'}
          </span>
          <span className="rounded-md bg-slate-100 px-2 py-1">
            难度 {question!.difficulty}
          </span>
          {question!.pointCodes.map((c) => (
            <Link
              key={c}
              to={`/point/${c}`}
              className="rounded-md bg-indigo-50 px-2 py-1 text-indigo-600 active:bg-indigo-100"
            >
              {c}
            </Link>
          ))}
        </div>
        <h3 className="text-[17px] font-medium leading-7 text-slate-800">
          {question!.stem}
        </h3>

        <div className="mt-5 space-y-3">
          {question!.options.map((opt) => {
            const chosen = selected.includes(opt.id);
            const isAns = question!.answer.includes(opt.id);
            let cls = 'border-slate-200 active:border-indigo-300 active:bg-slate-50';
            if (submitted) {
              if (isAns) cls = 'border-emerald-400 bg-emerald-50';
              else if (chosen) cls = 'border-rose-400 bg-rose-50';
            } else if (chosen) {
              cls = 'border-indigo-500 bg-indigo-50';
            }
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(opt.id)}
                className={`flex w-full min-h-[52px] items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition ${cls}`}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-slate-600 shadow-sm">
                  {opt.id}
                </span>
                <span className="pt-0.5 text-[16px] leading-6 text-slate-800">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div
            className={`mt-4 rounded-xl p-4 text-[15px] leading-7 ${
              isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
            }`}
          >
            <div className="font-semibold">{isCorrect ? '回答正确' : '回答错误'}</div>
            <div className="mt-1">正确答案：{question!.answer.join('、')}</div>
            <div className="mt-2 text-slate-700">{question!.explanation}</div>
          </div>
        )}
      </div>

      <div className="fixed bottom-[calc(3.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        {!submitted ? (
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={submit}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-base font-semibold text-white active:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            提交答案
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 text-base font-semibold text-white active:bg-indigo-700"
          >
            {index + 1 >= pool.length ? '查看成绩' : '下一题'}
          </button>
        )}
      </div>
    </div>
  );
}
