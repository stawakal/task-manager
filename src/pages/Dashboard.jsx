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

      <header className="sticky top-0 z-40 bg-white/85 dark:bg-charcoal/85 backdrop-blur-xl border-b border-gray-200/70 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-sm font-bold shadow-glow">
                F
              </div>
              <h1 className="text-lg font-semibold tracking-tight text-charcoal dark:text-white">Flow</h1>
            </div>
            <div className="flex items-center gap-1 lg:hidden">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
                {dark ? '☀️' : '🌙'}
              </button>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">⚙️</Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">⌕</span>
              <input
                type="search"
                placeholder="Search tasks"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-espresso/60 text-sm focus:ring-2 focus:ring-violet-400/60 focus:border-violet-400 transition"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-espresso/60 text-sm"
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
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-espresso/60 text-sm"
              >
                <option value="">All tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            )}
            <div className="hidden lg:flex items-center gap-1">
              <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10" aria-label="Toggle theme">
                {dark ? '☀️' : '🌙'}
              </button>
              <Link to="/settings" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">⚙️</Link>
            </div>
            <button
              onClick={() => logout().then(() => navigate('/auth'))}
              className="text-sm text-charcoal/60 dark:text-gray-400 hover:text-charcoal dark:hover:text-white px-2"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero card */}
        <div className="relative mb-6 overflow-hidden rounded-3xl bg-hero-gradient text-white p-6 sm:p-8 shadow-glow">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">{format(new Date(), 'EEEE, MMMM d')}</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}.</h2>
              <p className="mt-2 text-sm text-white/80">{motivationalMessage}</p>
              <button
                onClick={() => { setCreateForDate(null); setShowCreate(true); }}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 font-medium hover:bg-violet-50 transition shadow-soft"
              >
                <span className="text-lg leading-none">+</span> New task
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:min-w-[260px]">
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/15 p-3.5">
                <p className="text-xs text-white/70">Today</p>
                <p className="text-2xl font-semibold mt-1">{totalToday}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{completedToday} done</p>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/15 p-3.5">
                <p className="text-xs text-white/70">Overdue</p>
                <p className="text-2xl font-semibold mt-1">{overdueTasks.length}</p>
                <p className="text-[11px] text-white/70 mt-0.5">need action</p>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/15 p-3.5">
                <p className="text-xs text-white/70">Upcoming</p>
                <p className="text-2xl font-semibold mt-1">{upcomingTasks.length}</p>
                <p className="text-[11px] text-white/70 mt-0.5">scheduled</p>
              </div>
              <div className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/15 p-3.5">
                <p className="text-xs text-white/70">Progress</p>
                <p className="text-2xl font-semibold mt-1">{progress}%</p>
                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-white dark:bg-espresso/60 border border-gray-200/70 dark:border-white/5 shadow-soft">
            {Object.entries(VIEWS).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  view === k
                    ? 'bg-hero-gradient text-white shadow-glow'
                    : 'text-charcoal/70 dark:text-gray-300 hover:text-charcoal dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCreateForDate(null); setShowCreate(true); }}
            className="px-5 py-2.5 rounded-xl bg-charcoal dark:bg-violet-500 text-white font-medium hover:bg-espresso dark:hover:bg-violet-400 transition flex items-center gap-2 shadow-soft"
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
