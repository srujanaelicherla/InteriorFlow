import { useNavigate } from "react-router-dom"

type Props = {
  id: string
  name: string
  progress: number
}

export default function RoomCard({ id, name, progress }: Props) {

  const navigate = useNavigate()

  return (

    <div
      onClick={() => navigate(`/room/${id}`)}
      className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition"
    >

      <h2 className="text-xl font-semibold mb-3">
        {name}
      </h2>

      <div className="w-full bg-gray-200 rounded-full h-3">

        <div
          className="bg-primary h-3 rounded-full"
          style={{ width: `${progress}%` }}
        />

      </div>

      <p className="text-sm text-gray-500 mt-2">
        {progress}% completed
      </p>

    </div>
  )
}