import { useEffect, useMemo, useState } from 'react'
import FilterBar from './components/FilterBar'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import WeekList from './components/WeekList'
import type { Filter, Task, TaskStatus } from './types'

const STORAGE_KEY = 'weekly-planner:tasks'
const WEEK_KEY = 'weekly-planner:selectedWeek'
const WEEKS_KEY = 'weekly-planner:weeks'
const DEFAULT_WEEKS = 8
const MAX_WEEKS = 20

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return []
    try {
      return JSON.parse(saved) as Task[]
    } catch {
      return []
    }
  })

  const [weeks, setWeeks] = useState<number[]>(() => {
    const saved = localStorage.getItem(WEEKS_KEY)
    const parsed = Number(saved)
    const total =
      Number.isNaN(parsed) || parsed < DEFAULT_WEEKS
        ? DEFAULT_WEEKS
        : Math.min(parsed, MAX_WEEKS)
    return Array.from({ length: total }, (_, index) => index + 1)
  })

  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    const saved = localStorage.getItem(WEEK_KEY)
    const parsed = Number(saved)
    if (Number.isNaN(parsed) || parsed === 0) return 1
    return parsed
  })

  const [showAllWeeks, setShowAllWeeks] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(WEEK_KEY, String(selectedWeek))
  }, [selectedWeek])

  useEffect(() => {
    localStorage.setItem(WEEKS_KEY, String(weeks.length))
  }, [weeks])

  const baseTasks = useMemo(() => {
    return showAllWeeks
      ? tasks
      : tasks.filter((task) => task.week === selectedWeek)
  }, [tasks, showAllWeeks, selectedWeek])

  const visibleTasks = useMemo(() => {
    if (filter === 'not-started') {
      return baseTasks.filter((task) => task.status === 'Not Started')
    }

    if (filter === 'in-progress') {
      return baseTasks.filter((task) => task.status === 'In Progress')
    }

    if (filter === 'done') {
      return baseTasks.filter((task) => task.status === 'Done')
    }

    return baseTasks
  }, [baseTasks, filter])

  const sortedTasks = useMemo(() => {
    const list = [...visibleTasks]
    if (showAllWeeks) {
      list.sort((a, b) => {
        if (a.week === b.week) {
          return b.createdAt - a.createdAt
        }
        return a.week - b.week
      })
    }
    return list
  }, [visibleTasks, showAllWeeks])

  const counts = useMemo(() => {
    const notStarted = baseTasks.filter((task) => task.status === 'Not Started').length
    const inProgress = baseTasks.filter((task) => task.status === 'In Progress').length
    const done = baseTasks.filter((task) => task.status === 'Done').length

    return {
      all: baseTasks.length,
      notStarted,
      inProgress,
      done,
    }
  }, [baseTasks])

  const addTask = (title: string, week: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      week,
      status: 'Not Started',
      createdAt: Date.now(),
    }

    setTasks((prev) => [newTask, ...prev])
    setSelectedWeek(week)
  }

  const addWeek = () => {
    setWeeks((prev) => {
      if (prev.length >= MAX_WEEKS) return prev
      const nextWeek = prev.length + 1
      setSelectedWeek(nextWeek)
      return [...prev, nextWeek]
    })
  }

  const removeWeek = (weekToRemove: number) => {
    setWeeks((prev) => {
      if (prev.length <= 1) return prev
      const nextLength = prev.length - 1
      return Array.from({ length: nextLength }, (_, index) => index + 1)
    })

    setTasks((prev) =>
      prev
        .filter((task) => task.week !== weekToRemove)
        .map((task) =>
          task.week > weekToRemove ? { ...task, week: task.week - 1 } : task
        )
    )

    setSelectedWeek((prev) => {
      if (prev === weekToRemove) {
        return Math.max(1, weekToRemove - 1)
      }
      if (prev > weekToRemove) {
        return prev - 1
      }
      return prev
    })
  }

  const resetPlan = () => {
    setTasks([])
    setWeeks(Array.from({ length: DEFAULT_WEEKS }, (_, index) => index + 1))
    setSelectedWeek(1)
    setShowAllWeeks(false)
    setFilter('all')
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status } : task))
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Weekly Planner
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Plan tasks week by week
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Track progress, keep focus, and build weekly momentum.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <WeekList
              weeks={weeks}
              selectedWeek={selectedWeek}
              tasks={tasks}
              onSelect={setSelectedWeek}
              onAddWeek={addWeek}
              canAddWeek={weeks.length < MAX_WEEKS}
              onRemoveWeek={removeWeek}
              canRemoveWeek={weeks.length > 1}
              onReset={resetPlan}
            />
          </aside>

          <main className="space-y-5">
            <TaskForm
              weeks={weeks}
              selectedWeek={selectedWeek}
              onAdd={addTask}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-slate-700">
                  {showAllWeeks ? 'All weeks tasks' : `Week ${selectedWeek} tasks`}
                </p>
                <p className="text-sm text-slate-500">
                  {showAllWeeks
                    ? 'See everything in one place, grouped by week.'
                    : 'Keep tasks short and action-focused.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    type="button"
                    onClick={() => setShowAllWeeks(false)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      showAllWeeks
                        ? 'text-slate-500 hover:text-slate-700'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    This week
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAllWeeks(true)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      showAllWeeks
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    All weeks
                  </button>
                </div>
                <FilterBar filter={filter} onChange={setFilter} counts={counts} />
              </div>
            </div>

            <div
              className={`${
                showAllWeeks || sortedTasks.length > 6
                  ? 'max-h-[520px] overflow-y-auto pr-2'
                  : ''
              }`}
            >
              <TaskList
                tasks={sortedTasks}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
