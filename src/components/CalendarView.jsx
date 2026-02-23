import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { updateTask } from '../lib/storage'
import TaskItem from './TaskItem'

export default function CalendarView({ tasks, onDelete, onAddForDate }) {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getTasksForDate = (date) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false
      const taskDateStr = typeof t.dueDate === 'string' ? t.dueDate : t.dueDate.toISOString?.().slice(0, 10)
      const dateStr = format(date, 'yyyy-MM-dd')
      return taskDateStr?.slice(0, 10) === dateStr
    })
  }

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const padStart = monthStart.getDay()
  const padEnd = 6 - monthEnd.getDay()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        >
          ←
        </button>
        <h3 className="text-lg font-medium text-charcoal dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-charcoal/60 dark:text-gray-400 py-2">
            {d}
          </div>
        ))}
        {Array.from({ length: padStart }).map((_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const dayTasks = getTasksForDate(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square rounded-xl text-sm flex flex-col items-center justify-center transition ${
                isSelected
                  ? 'bg-lavender text-white shadow-md'
                  : isSameMonth(day, currentMonth)
                    ? 'bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200/40 dark:border-gray-700/50'
                    : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <span>{format(day, 'd')}</span>
              {dayTasks.length > 0 && (
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-lavender'}`}>
                  {dayTasks.length}
                </span>
              )}
            </button>
          )
        })}
        {Array.from({ length: padEnd }).map((_, i) => (
          <div key={`pad-end-${i}`} className="aspect-square" />
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-charcoal dark:text-gray-300">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            {onAddForDate && (
              <button
                onClick={() => onAddForDate(selectedDate)}
                className="text-sm font-medium text-lavender hover:text-lavender/80"
              >
                + Add task
              </button>
            )}
          </div>
          {selectedTasks.length > 0 ? (
            <ul className="space-y-2">
              {selectedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={async () => {
                    await updateTask(user.uid, task.id, { completed: !task.completed })
                  }}
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
          ) : (
            <p className="text-sm text-charcoal/50 dark:text-gray-500">No tasks for this day.</p>
          )}
        </div>
      )}
    </div>
  )
}
