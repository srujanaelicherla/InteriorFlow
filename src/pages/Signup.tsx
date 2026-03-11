import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch {
      setError("Failed to create account. Email may be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">Join InteriorFlow</h1>
        <p className="text-slate-500 text-center mb-10">Start managing your dream home project</p>

        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-black font-bold underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}