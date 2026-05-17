"use client";

interface ScoreGaugeProps {
  current: number;
  target: number;
  label: string;
  sublabel: string;
}

export function ScoreGauge({ current, target, label, sublabel }: ScoreGaugeProps) {
  const pct = Math.min(100, (current / target) * 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900">{current}</span>
          <span className="text-xs text-gray-400">/ {target}</span>
        </div>
      </div>
      <p className="font-bold text-gray-900 mt-3">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
      <div className="w-full mt-4 bg-gray-100 rounded-full h-1.5">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{Math.round(pct)}% to goal</p>
    </div>
  );
}
