import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  FieldValue
} from "firebase/firestore";
import { db } from "../firebase";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: Timestamp | FieldValue;
};

export function subscribeTasks(
  roomId: string,
  onData: (tasks: Task[]) => void
): () => void {
  const ref = collection(db, "rooms", roomId, "tasks");
  const q = query(ref, orderBy("completed", "asc"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as Task[];
    onData(tasks);
  });
}

export async function createTask(roomId: string, title: string): Promise<void> {
  const ref = collection(db, "rooms", roomId, "tasks");
  await addDoc(ref, { 
    title, 
    completed: false, 
    createdAt: serverTimestamp() 
  });
}

export async function toggleTask(roomId: string, taskId: string, newStatus: boolean): Promise<void> {
  const ref = doc(db, "rooms", roomId, "tasks", taskId);
  await updateDoc(ref, { completed: newStatus });
}