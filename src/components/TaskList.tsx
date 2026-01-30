import type { Task, TaskStatus } from '../types'

type TaskListProps = {
  tasks: Task[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

const STATUS_OPTIONS: TaskStatus[] = ['Not Started', 'In Progress', 'Done']

export default function TaskList({ tasks, onDelete, onStatusChange }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-base text-slate-500">
        No tasks yet. Add your first task above.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-lg font-semibold text-slate-900">{task.title}</p>
            <p className="text-sm text-slate-500">Week {task.week}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={task.status}
              onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
