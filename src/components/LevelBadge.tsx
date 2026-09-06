import { levelColor } from '../lib/curriculum';

export default function LevelBadge({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        levelColor[level] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {level}
    </span>
  );
}
