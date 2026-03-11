import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">Welcome Back</h1>
        <p className="text-slate-500 text-center mb-10">Access your InteriorFlow dashboard</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:bg-slate-400"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          New to the platform? <Link to="/signup" className="text-black font-bold underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}