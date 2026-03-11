import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import RoomDetails from "./pages/RoomDetails"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/room/:id" element={<RoomDetails />} />

      </Routes>

    </BrowserRouter>

  )
}

export default App