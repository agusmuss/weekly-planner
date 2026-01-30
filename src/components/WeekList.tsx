import type { Task } from '../types'

type WeekListProps = {
  weeks: number[]
  selectedWeek: number
  tasks: Task[]
  onSelect: (week: number) => void
  onAddWeek: () => void
  canAddWeek: boolean
  onRemoveWeek: (week: number) => void
  canRemoveWeek: boolean
  onReset: () => void
}

export default function WeekList({
  weeks,
  selectedWeek,
  tasks,
  onSelect,
  onAddWeek,
  canAddWeek,
  onRemoveWeek,
  canRemoveWeek,
  onReset,
}: WeekListProps) {
  const listClass =
    weeks.length > 8
      ? 'space-y-3 max-h-96 overflow-y-auto pr-1'
      : 'space-y-3'

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Weeks
      </p>
      <div className={listClass}>
        {weeks.map((week) => {
          const count = tasks.filter((task) => task.week === week).length
          const isActive = week === selectedWeek

          return (
            <button
              key={week}
              type="button"
              onClick={() => onSelect(week)}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-base transition ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              <span>Week {week}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-sm font-semibold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onAddWeek}
        disabled={!canAddWeek}
        className={`w-full rounded-lg border px-4 py-2 text-sm font-semibold transition ${
          canAddWeek
            ? 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
            : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
        }`}
      >
        Add week
      </button>
      <button
        type="button"
        onClick={() => onRemoveWeek(selectedWeek)}
        disabled={!canRemoveWeek}
        className={`w-full rounded-lg border px-4 py-2 text-sm font-semibold transition ${
          canRemoveWeek
            ? 'border-slate-200 bg-white text-slate-600 hover:border-red-400 hover:text-red-600'
            : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
        }`}
      >
        Remove week
      </button>
      <button
        type="button"
        onClick={() => {
          const confirmed = window.confirm(
            'Are you sure? this reset cannot be reverted.'
          )
          if (confirmed) {
            onReset()
          }
        }}
        className="w-full rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Reset plan
      </button>
      {!canAddWeek ? (
        <p className="text-xs text-slate-400">
          Max {weeks.length} weeks reached.
        </p>
      ) : null}
    </div>
  )
}
