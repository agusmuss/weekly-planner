import type { Filter } from '../types'

type FilterBarProps = {
  filter: Filter
  onChange: (filter: Filter) => void
  counts: {
    all: number
    notStarted: number
    inProgress: number
    done: number
  }
}

export default function FilterBar({ filter, onChange, counts }: FilterBarProps) {
  const options: { label: string; value: Filter; count: number }[] = [
    { label: 'All', value: 'all', count: counts.all },
    { label: 'Not Started', value: 'not-started', count: counts.notStarted },
    { label: 'In Progress', value: 'in-progress', count: counts.inProgress },
    { label: 'Done', value: 'done', count: counts.done },
  ]

  const getBorderClasses = (value: Filter) => {
    switch (value) {
      case 'not-started':
        return 'border-slate-300 text-slate-600'
      case 'in-progress':
        return 'border-sky-300 text-slate-600'
      case 'done':
        return 'border-emerald-300 text-slate-600'
      default:
        return 'border-slate-200 text-slate-600'
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isActive = filter === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-5 py-2 text-base font-medium transition ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : `bg-white ${getBorderClasses(option.value)} hover:border-slate-400`
            }`}
          >
            {option.label} ({option.count})
          </button>
        )
      })}
    </div>
  )
}
