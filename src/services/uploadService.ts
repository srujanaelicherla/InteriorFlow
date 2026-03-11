import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Updates the room document with an external image link.
 * @param roomId - The ID of the room to update
 * @param url - The external URL (e.g., from Imgur or Pinterest)
 * @param type - Whether it's the 2D plan or 3D rendering
 */
export const updateRoomRenderingUrl = async (
  roomId: string, 
  url: string, 
  type: 'image2d' | 'image3d'
): Promise<void> => {
  if (!url.trim()) throw new Error("URL cannot be empty");

  try {
    const roomDoc = doc(db, "rooms", roomId);
    
    // Dynamically update either image2d or image3d field
    await updateDoc(roomDoc, {
      [type]: url.trim()
    });
  } catch (error) {
    console.error("Error updating room link:", error);
    throw new Error("Failed to save the design link.");
  }
};