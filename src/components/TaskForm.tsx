import { useState } from 'react'
import type { FormEvent } from 'react'

type TaskFormProps = {
  weeks: number[]
  selectedWeek: number
  onAdd: (title: string, week: number) => void
}

export default function TaskForm({ weeks, selectedWeek, onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [week, setWeek] = useState(selectedWeek)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    onAdd(trimmed, week)
    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task for the week"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-base focus:border-slate-400 focus:outline-none"
          />
        </div>
        <div className="w-full md:w-40">
          <label className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Week
          </label>
          <select
            value={week}
            onChange={(event) => setWeek(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-base focus:border-slate-400 focus:outline-none"
          >
            {weeks.map((value) => (
              <option key={value} value={value}>
                Week {value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  )
}
