import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Settings() {
  const { dark, setDark } = useTheme()
  const { user, isDemoMode } = useAuth()

  return (
    <div className="min-h-screen bg-offwhite dark:bg-charcoal">
      <header className="border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-charcoal/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-charcoal/60 dark:text-gray-400 hover:text-charcoal dark:hover:text-white">← Back</Link>
          <h1 className="text-xl font-semibold text-charcoal dark:text-white">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-espresso/50 border border-gray-200/50 dark:border-white/5">
            <h2 className="text-lg font-medium text-charcoal dark:text-white mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-charcoal dark:text-gray-300">Dark mode</span>
              <button
                onClick={() => setDark(!dark)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  dark ? 'bg-lavender' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    dark ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {isDemoMode && (
            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30">
              <h2 className="text-lg font-medium text-amber-800 dark:text-amber-200 mb-2">Demo mode</h2>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Firebase is not configured. You're using local storage. Tasks are saved on this device only.
                To enable cloud sync and Google login, add your Firebase config to a <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">.env</code> file.
              </p>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white dark:bg-espresso/50 border border-gray-200/50 dark:border-white/5">
            <h2 className="text-lg font-medium text-charcoal dark:text-white mb-2">Account</h2>
            <p className="text-sm text-charcoal/60 dark:text-gray-400">
              {user?.email || user?.displayName || 'Signed in'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
