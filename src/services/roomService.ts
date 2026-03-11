import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  FieldValue 
} from "firebase/firestore";
import { db } from "../firebase";

export interface Room {
  id: string;
  name: string;
  progress: number;
  createdAt?: Timestamp | FieldValue;
}

export const subscribeRooms = (onData: (rooms: Room[]) => void) => {
  const roomsRef = collection(db, "rooms");
  const q = query(roomsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const rooms = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Unnamed Room",
        progress: data.progress ?? 0,
        createdAt: data.createdAt,
      };
    }) as Room[];
    onData(rooms);
  });
};

export const createRoom = async (name: string): Promise<string> => {
  const docRef = await addDoc(collection(db, "rooms"), {
    name: name.trim(),
    progress: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};