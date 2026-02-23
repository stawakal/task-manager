import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateTask } from '../lib/storage'
import TaskItem from './TaskItem'

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-50 dark:bg-gray-800/60' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-amber-50/80 dark:bg-amber-900/10' },
  { id: 'done', title: 'Done', color: 'bg-emerald-50/80 dark:bg-emerald-900/10' },
]

export default function KanbanView({ tasks, onDelete }) {
  const { user } = useAuth()
  const [editingId, setEditingId] = useState(null)

  const getTasksByColumn = (columnId) => {
    return tasks.filter(t => (t.status || (t.completed ? 'done' : 'todo')) === columnId)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    await updateTask(user.uid, taskId, { 
      status: newStatus, 
      completed: newStatus === 'done' 
    })
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    e.stopPropagation()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) handleStatusChange(taskId, columnId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLUMNS.map(col => (
        <div
          key={col.id}
          className={`rounded-2xl p-4 min-h-[280px] ${col.color} border border-gray-200/60 dark:border-gray-700/50 flex flex-col`}
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={handleDragOver}
        >
          <h3 className="text-sm font-medium text-charcoal dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>{col.title}</span>
            <span className="text-xs text-charcoal/50 dark:text-gray-500">
              ({getTasksByColumn(col.id).length})
            </span>
          </h3>
          <div className="space-y-2 flex-1 min-h-0" onDrop={(e) => handleDrop(e, col.id)} onDragOver={handleDragOver}>
            {getTasksByColumn(col.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="cursor-grab active:cursor-grabbing"
              >
                <TaskItem
                  task={{ ...task, completed: col.id === 'done' }}
                  onToggle={async () => {
                    const next = col.id === 'done' ? 'todo' : 'done'
                    await handleStatusChange(task.id, next)
                  }}
                  onDelete={() => onDelete(task)}
                  onEdit={() => setEditingId(editingId === task.id ? null : task.id)}
                  isEditing={editingId === task.id}
                  onSaveEdit={async (updates) => {
                    await updateTask(user.uid, task.id, updates)
                    setEditingId(null)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
