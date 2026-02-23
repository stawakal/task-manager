import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { updateTask } from '../lib/storage'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, onDelete, showSections = true, filtered = true }) {
  const { user } = useAuth()
  const [editingId, setEditingId] = useState(null)

  const handleToggle = async (task) => {
    const completed = !task.completed
    await updateTask(user.uid, task.id, { completed, status: completed ? 'done' : 'todo' })
  }

  const handleStatusChange = async (task, newStatus) => {
    await updateTask(user.uid, task.id, { status: newStatus })
  }

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center text-charcoal/50 dark:text-gray-500">
        <p className="text-sm">No tasks yet.</p>
        <p className="text-xs mt-1">Add a task to get started.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => handleToggle(task)}
          onDelete={() => onDelete(task)}
          onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
          isEditing={editingId === task.id}
          onSaveEdit={async (updates) => {
            await updateTask(user.uid, task.id, updates)
            setEditingId(null)
          }}
        />
      ))}
    </ul>
  )
}
