import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import { TaskItem } from "../components/TaskItem";
import { subscribeTasks, createTask, toggleTask } from "../services/taskService";
import type { Task } from "../services/taskService";

// 1. Define the Room interface to fix the 'any' errors
interface Room {
  name: string;
  image2d?: string;
  image3d?: string;
}

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  
  // 2. Correct Array Destructuring []
  const [tasks, setTasks] = useState<Task[]>([]);
  const [roomMetadata, setRoomMetadata] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // 3. Sync Room Metadata (Name & Images)
  useEffect(() => {
    if (!id) return;
    const roomRef = doc(db, "rooms", id);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setRoomMetadata(docSnap.data() as Room);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // 4. Sync Checklist Tasks
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeTasks(id, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // 5. Progress Calculation logic
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  // 6. Milestone Handlers
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTaskTitle.trim();
    if (!id || !trimmedTitle || isAdding) return;

    setIsAdding(true);
    try {
      await createTask(id, trimmedTitle);
      setNewTaskTitle("");
    } catch {
      alert("Failed to add milestone.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = useCallback(async (taskId: string, currentStatus: boolean) => {
    if (!id) return;
    const nextStatus = !currentStatus;

    // Optimistic UI Update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: nextStatus } : t))
    );

    try {
      await toggleTask(id, taskId, nextStatus);
    } catch {
      // Rollback on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: currentStatus } : t))
      );
    }
  }, [id]);

  // 7. External Link Update Logic (Replaces paid storage)
  const updateImageLink = async (type: 'image2d' | 'image3d') => {
    const url = window.prompt(`Paste the public URL for the ${type === 'image2d' ? '2D Plan' : '3D Design'}:`);
    if (!url || !id) return;
    
    try {
      await updateDoc(doc(db, "rooms", id), { [type]: url.trim() });
    } catch {
      alert("Failed to update link.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      
      <main className="flex-1 max-w-6xl mx-auto p-8 lg:p-12">
        <nav className="mb-6 text-sm">
          <Link to="/" className="text-slate-400 hover:text-black transition-colors font-medium">
            ← Back to Dashboard
          </Link>
        </nav>
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {roomMetadata?.name || "Loading Room..."}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Tracking {tasks.length} construction milestones.</p>
          </div>
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 min-w-[260px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completion</span>
              <span className="text-lg font-black text-black">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-black h-full transition-all duration-1000 ease-in-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Milestone Section */}
          <section className="lg:col-span-5">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Milestones</h2>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
              <input 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="E.g., Painting Finish"
                className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all text-sm"
              />
              <button 
                type="submit" 
                disabled={isAdding || !newTaskTitle.trim()}
                className="bg-black text-white px-6 py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:bg-slate-300"
              >
                {isAdding ? "..." : "Add"}
              </button>
            </form>

            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-16 bg-slate-200 rounded-2xl" />
                  <div className="h-16 bg-slate-200 rounded-2xl" />
                </div>
              ) : (
                tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={handleToggle} />
                ))
              )}
            </div>
          </section>

          {/* Design Visuals Section */}
          <section className="lg:col-span-7 space-y-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Design Visuals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 2D Plan */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                  {roomMetadata?.image2d ? (
                    <img src={roomMetadata.image2d} alt="2D Plan" className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="text-slate-300 font-bold uppercase tracking-tighter text-xs">No 2D Design Link</span>
                  )}
                </div>
                <button 
                  onClick={() => updateImageLink('image2d')}
                  className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Edit 2D URL
                </button>
              </div>

              {/* 3D Plan */}
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                  {roomMetadata?.image3d ? (
                    <img src={roomMetadata.image3d} alt="3D Visual" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-300 font-bold uppercase tracking-tighter text-xs">No 3D Visual Link</span>
                  )}
                </div>
                <button 
                  onClick={() => updateImageLink('image3d')}
                  className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Edit 3D URL
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}