import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { addTask } from '../lib/storage'

const PRIORITIES = ['low', 'medium', 'high']
const DEFAULT_TAGS = ['school', 'work', 'personal']

export default function TaskCreateModal({ open, onClose, defaultDate }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    if (open) {
      const today = format(new Date(), 'yyyy-MM-dd')
      setDueDate(defaultDate ? format(new Date(defaultDate), 'yyyy-MM-dd') : today)
    }
  }, [open, defaultDate])
  const [tags, setTags] = useState([])
  const [customTag, setCustomTag] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const addCustomTag = () => {
    const t = customTag.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t])
      setCustomTag('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await addTask(user.uid, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        tags: tags.length ? tags : undefined,
        completed: false,
        status: 'todo',
      })
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('medium')
      setTags([])
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/50 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-4">New task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 focus:ring-2 focus:ring-lavender/50 focus:border-lavender"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add details..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 focus:ring-2 focus:ring-lavender/50 focus:border-lavender resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Due date</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50"
                  />
                  <button
                    type="button"
                    onClick={() => setDueDate(format(new Date(), 'yyyy-MM-dd'))}
                    className="px-4 py-3 rounded-xl bg-lavender/20 text-lavender dark:bg-lavender/10 font-medium text-sm whitespace-nowrap hover:bg-lavender/30 dark:hover:bg-lavender/20 transition"
                  >
                    Today
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50"
                >
                  {PRIORITIES.map(p => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {DEFAULT_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      tags.includes(tag)
                        ? 'bg-lavender/30 dark:bg-lavender/20 text-lavender dark:text-lavender'
                        : 'bg-gray-100 dark:bg-gray-700 text-charcoal dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {tags.filter(t => !DEFAULT_TAGS.includes(t)).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 rounded-full text-sm bg-lavender/30 dark:bg-lavender/20 text-lavender"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  placeholder="Add custom tag"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-sm"
                />
                <button type="button" onClick={addCustomTag} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm">Add</button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-charcoal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 py-3 rounded-xl bg-charcoal dark:bg-lavender text-white font-medium hover:bg-espresso dark:hover:bg-lavender/90 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
