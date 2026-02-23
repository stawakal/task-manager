import { useAuth } from '../contexts/AuthContext'
import { deleteTask } from '../lib/storage'

export default function DeleteConfirmModal({ task, onConfirm, onCancel }) {
  const { user } = useAuth()

  const handleDelete = async () => {
    await deleteTask(user.uid, task.id)
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div 
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200/60 dark:border-gray-700/50 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-2">Delete task?</h3>
        <p className="text-sm text-charcoal/60 dark:text-gray-400 mb-6">
          "{task?.title}" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-charcoal dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
