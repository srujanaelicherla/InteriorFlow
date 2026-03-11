import { useState } from "react";
import { updateRoomRenderingUrl } from "../services/uploadService";

interface Props {
  roomId: string;
  type: 'image2d' | 'image3d';
}

export default function RenderingLinkInput({ roomId, type }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLinkUpdate = async () => {
    const url = window.prompt(`Paste the public URL for the ${type === 'image2d' ? '2D Plan' : '3D Design'}:`);
    
    if (!url || !url.trim()) return;

    setIsUpdating(true);
    try {
      await updateRoomRenderingUrl(roomId, url, type);
    } catch {
      alert("Failed to update the link. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleLinkUpdate}
      disabled={isUpdating}
      className="mt-2 text-sm font-semibold text-slate-600 hover:text-black transition-colors underline decoration-slate-300 underline-offset-4"
    >
      {isUpdating ? "Updating..." : `Set ${type === 'image2d' ? '2D' : '3D'} Link`}
    </button>
  );
}