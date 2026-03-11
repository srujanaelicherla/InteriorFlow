import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RoomCard from "../components/RoomCard";
import { createRoom, subscribeRooms } from "../services/roomService";
import type { Room } from "../services/roomService"; // This is the "type-only" import

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeRooms((data) => {
      setRooms(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddRoom = async () => {
    const name = prompt("Enter Room Name:");
    if (!name?.trim()) return;

    try {
      await createRoom(name);
    } catch {
      // The variable is omitted, so the 'unused-vars' error disappears
      alert("Error creating room. Check your internet connection.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Project Dashboard
          </h1>
          <button
            onClick={handleAddRoom}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            + Add Room
          </button>
        </div>

        {loading ? (
          <p>Loading workspaces...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
