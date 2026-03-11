import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { TaskItem } from "../components/TaskItem";
import { subscribeTasks, createTask, toggleTask } from "../services/taskService";
import type { Task } from "../services/taskService";

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // 1. Subscribe to real-time task updates
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeTasks(id, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // 2. Calculate progress dynamically for the UI
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  // 3. Handle adding a new construction milestone
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (!id || !trimmedTitle || isAdding) return;

    setIsAdding(true);
    try {
      await createTask(id, trimmedTitle);
      setNewTaskTitle("");
    } catch {
      alert("Failed to add task. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  // 4. Handle toggling tasks with Optimistic Rollback
  const handleToggle = useCallback(async (taskId: string, currentStatus: boolean) => {
    if (!id) return;
    const nextStatus = !currentStatus;

    // UI Updates Instantly (Optimistic)
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextStatus } : t))
    );

    try {
      await toggleTask(id, taskId, nextStatus);
    } catch {
      // Revert if database update fails
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: currentStatus } : t))
      );
      alert("Sync failed. Reverting changes.");
    }
  }, [id]);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      
      <main className="flex-1 max-w-5xl mx-auto p-6 lg:p-12">
        {/* Breadcrumbs & Header */}
        <nav className="mb-4 text-sm text-slate-500">
          <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link> / Room Details
        </nav>
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Room Checklist</h1>
            <p className="text-slate-500 mt-2">Track construction milestones and design phases.</p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[200px]">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-600">Completion</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        {/* Task Input Form */}
        <form onSubmit={handleAddTask} className="flex gap-3 mb-10">
          <input 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="E.g., Final Electrical Fitting..."
            className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
          <button 
            type="submit" 
            disabled={isAdding || !newTaskTitle.trim()}
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isAdding ? "Saving..." : "Add Milestone"}
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400">No milestones set for this room yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={handleToggle} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Future Designer Upload Section */}
        <section className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Design Renderings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
              No 2D Blueprint Uploaded
            </div>
            <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
              No 3D Model Uploaded
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}