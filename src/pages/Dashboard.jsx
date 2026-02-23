import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { subscribeTasks } from '../lib/storage'
import { format, isToday, isPast } from 'date-fns'
import TaskCreateModal from '../components/TaskCreateModal'
import TaskList from '../components/TaskList'
import KanbanView from '../components/KanbanView'
import CalendarView from '../components/CalendarView'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import Confetti from '../components/Confetti'

const VIEWS = { list: 'List', kanban: 'Kanban', calendar: 'Calendar' }

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState('list')
  const [showCreate, setShowCreate] = useState(false)
  const [createForDate, setCreateForDate] = useState(null)
  const [deleteTask, setDeleteTask] = useState(null)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const userId = user?.uid

  useEffect(() => {
    if (!userId) return
    return subscribeTasks(userId, setTasks)
  }, [userId])

  const filteredTasks = tasks.filter(t => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase()) && !(t.description || '').toLowerCase().includes(search.toLowerCase())) return false
    if (filterPriority && t.priority !== filterPriority) return false
    if (filterTag && !(t.tags || []).includes(filterTag)) return false
    return true
  })

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const parseTaskDate = (t) => {
    if (!t.dueDate) return null
    const s = typeof t.dueDate === 'string' ? t.dueDate : t.dueDate?.toISOString?.().slice(0, 10)
    return s?.slice(0, 10)
  }
  const todayTasks = filteredTasks.filter(t => parseTaskDate(t) === todayStr)
  const overdueTasks = filteredTasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    const d = parseTaskDate(t)
    return d && d < todayStr
  })
  const upcomingTasks = filteredTasks.filter(t => {
    if (!t.dueDate || t.completed) return false
    const d = parseTaskDate(t)
    return d && d > todayStr
  })
  const noDateTasks = filteredTasks.filter(t => !t.dueDate)

  const completedToday = todayTasks.filter(t => t.completed).length
  const totalToday = todayTasks.length
  const progress = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  const messages = [
    "You're doing great. Keep going.",
    "Progress, not perfection.",
    "One task at a time.",
    "You've got this.",
    "Small steps lead to big wins.",
  ]
  const motivationalMessage = totalToday > 0 
    ? `You're ${progress}% done today. ${messages[progress % messages.length]}`
    : "No tasks for today. Add some to get started."

  useEffect(() => {
    if (totalToday > 0 && completedToday === totalToday && totalToday >= 1) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(t)
    }
  }, [completedToday, totalToday])

  const allTags = [...new Set(tasks.flatMap(t => t.tags || []))]

  return (
    <div className="min-h-screen bg-offwhite dark:bg-charcoal">
      {showConfetti && <Confetti />}

      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1e1e1e]/95 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-charcoal dark:text-white">Flow</h1>
            <div className="flex items-center gap-2 sm:hidden">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
                {dark ? '☀️' : '🌙'}
              </button>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">⚙️</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-sm focus:ring-2 focus:ring-lavender/50 focus:border-lavender"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-sm"
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {allTags.length > 0 && (
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-charcoal/50 text-sm"
              >
                <option value="">All tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            )}
            <div className="hidden sm:flex items-center gap-1">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
                {dark ? '☀️' : '🌙'}
              </button>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">⚙️</Link>
            </div>
            <button
              onClick={() => logout().then(() => navigate('/auth'))}
              className="text-sm text-charcoal/60 dark:text-gray-400 hover:text-charcoal dark:hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress & motivational */}
        <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-gray-800/50 backdrop-blur border border-gray-200/60 dark:border-gray-700/50 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium text-charcoal dark:text-white">Today</h2>
              <p className="text-sm text-charcoal/60 dark:text-gray-400 mt-1">{motivationalMessage}</p>
            </div>
            <div className="flex-1 sm:max-w-xs">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-lavender dark:bg-lavender/80 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-charcoal/50 dark:text-gray-500 mt-1">{completedToday} of {totalToday} tasks done</p>
            </div>
          </div>
        </div>

        {/* View tabs & Add task */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {Object.entries(VIEWS).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  view === k 
                    ? 'bg-charcoal dark:bg-lavender text-white shadow-sm' 
                    : 'bg-white dark:bg-gray-800/50 text-charcoal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200/60 dark:border-gray-700/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCreateForDate(null); setShowCreate(true); }}
            className="px-5 py-2.5 rounded-xl bg-charcoal dark:bg-lavender text-white font-medium hover:bg-espresso dark:hover:bg-lavender/90 transition flex items-center gap-2"
          >
            <span>+</span> Add task
          </button>
        </div>

        {/* Main content area */}
        {view === 'list' && (
          <div className="space-y-8">
            {overdueTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-red-500 dark:text-red-400 mb-3">Overdue</h3>
                <TaskList tasks={overdueTasks} onDelete={setDeleteTask} />
              </section>
            )}
            {todayTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-charcoal dark:text-gray-300 mb-3">Today</h3>
                <TaskList tasks={todayTasks} onDelete={setDeleteTask} />
              </section>
            )}
            {upcomingTasks.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-charcoal dark:text-gray-300 mb-3">Upcoming</h3>
                <TaskList tasks={upcomingTasks} onDelete={setDeleteTask} />
              </section>
            )}
            {(noDateTasks.length > 0 || (overdueTasks.length === 0 && todayTasks.length === 0 && upcomingTasks.length === 0)) && (
              <section>
                <h3 className="text-sm font-medium text-charcoal dark:text-gray-300 mb-3">
                  {overdueTasks.length || todayTasks.length || upcomingTasks.length ? 'No date' : 'All tasks'}
                </h3>
                <TaskList tasks={noDateTasks.length > 0 ? noDateTasks : filteredTasks} onDelete={setDeleteTask} />
              </section>
            )}
          </div>
        )}
        {view === 'kanban' && (
          <KanbanView tasks={filteredTasks} onDelete={setDeleteTask} />
        )}
        {view === 'calendar' && (
          <CalendarView 
            tasks={filteredTasks} 
            onDelete={setDeleteTask} 
            onAddForDate={(d) => { setCreateForDate(d); setShowCreate(true); }}
          />
        )}
      </main>

      <TaskCreateModal open={showCreate} onClose={() => { setShowCreate(false); setCreateForDate(null); }} defaultDate={createForDate} />
      {deleteTask && (
        <DeleteConfirmModal
          task={deleteTask}
          onConfirm={() => setDeleteTask(null)}
          onCancel={() => setDeleteTask(null)}
        />
      )}
    </div>
  )
}
