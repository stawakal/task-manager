/**
 * Storage layer: Firebase Firestore when configured, else localStorage for demo
 */
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, getDocs, 
  query, where, onSnapshot, Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const TASKS_KEY = 'flow_tasks';
const USERS_KEY = 'flow_users';

function isFirebaseConfigured() {
  const pid = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return pid && pid !== 'your-project-id';
}

// LocalStorage fallback for demo (when Firebase not configured)
export function getLocalTasks(userId) {
  try {
    const data = localStorage.getItem(`${TASKS_KEY}_${userId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveLocalTasks(userId, tasks) {
  localStorage.setItem(`${TASKS_KEY}_${userId}`, JSON.stringify(tasks));
}

export async function fetchTasks(userId) {
  if (!userId) return [];
  
  if (isFirebaseConfigured()) {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }));
    return tasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
  
  return getLocalTasks(userId);
}

export function subscribeTasks(userId, callback) {
  if (!userId) return () => {};
  
  if (isFirebaseConfigured()) {
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() }));
      callback(tasks.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });
  }
  
  // Poll localStorage for demo
  const interval = setInterval(() => callback(getLocalTasks(userId)), 500);
  return () => clearInterval(interval);
}

export async function addTask(userId, task) {
  const taskData = {
    ...task,
    userId,
    status: task.status || 'todo',
    createdAt: new Date(),
  };

  if (isFirebaseConfigured()) {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...taskData };
  }

  const tasks = getLocalTasks(userId);
  const newTask = { id: `local_${Date.now()}`, ...taskData };
  tasks.unshift(newTask);
  saveLocalTasks(userId, tasks);
  return newTask;
}

export async function updateTask(userId, taskId, updates) {
  if (isFirebaseConfigured()) {
    await updateDoc(doc(db, 'tasks', taskId), updates);
    return;
  }

  const tasks = getLocalTasks(userId);
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updates };
    saveLocalTasks(userId, tasks);
  }
}

export async function deleteTask(userId, taskId) {
  if (isFirebaseConfigured()) {
    await deleteDoc(doc(db, 'tasks', taskId));
    return;
  }

  const tasks = getLocalTasks(userId).filter(t => t.id !== taskId);
  saveLocalTasks(userId, tasks);
}

export async function reorderTasks(userId, taskIds) {
  const tasks = getLocalTasks(userId);
  const reordered = taskIds.map(id => tasks.find(t => t.id === id)).filter(Boolean);
  saveLocalTasks(userId, reordered);
}
