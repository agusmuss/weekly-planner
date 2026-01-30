export type TaskStatus = 'Not Started' | 'In Progress' | 'Done'

export type Task = {
  id: string
  title: string
  week: number
  status: TaskStatus
  createdAt: number
}

export type Filter = 'all' | 'not-started' | 'in-progress' | 'done'
