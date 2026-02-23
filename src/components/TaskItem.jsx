import { useState } from 'react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { updateTask } from '../lib/storage'

const PRIORITY_COLORS = {
  low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, isEditing, onSaveEdit }) {
  const { user } = useAuth()
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description || '')

  const handleSave = () => {
    if (editTitle.trim()) {
      onSaveEdit({ title: editTitle.trim(), description: editDesc.trim() || undefined })
    }
  }

  return (
    <li
      className={`group flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all animate-fade-in ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          task.completed
            ? 'bg-lavender border-lavender animate-check'
            : 'border-gray-300 dark:border-gray-500 hover:border-lavender'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-charcoal dark:text-white"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              placeholder="Description"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-sm resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-3 py-1 rounded-lg bg-lavender text-white text-sm">Save</button>
              <button onClick={() => { setEditTitle(task.title); setEditDesc(task.description || ''); onEdit(); }} className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-600 text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className={`font-medium text-charcoal dark:text-white ${task.completed ? 'line-through text-charcoal/60 dark:text-gray-400' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-charcoal/60 dark:text-gray-400 mt-0.5">{task.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {task.dueDate && (
                <span className="text-xs text-charcoal/50 dark:text-gray-500">
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              )}
              {task.priority && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority] || ''}`}>
                  {task.priority}
                </span>
              )}
              {(task.tags || []).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-lavender/20 text-lavender dark:bg-lavender/10">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={onEdit} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-charcoal/60" title="Edit">✏️</button>
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">🗑️</button>
        </div>
      )}
    </li>
  )
}
