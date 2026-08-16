import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong creating your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-500/15 text-mint-400">
          <Leaf size={18} />
        </span>
        <span className="font-display text-xl text-bark">Create your account</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-canopy-700 bg-canopy-900/40 p-6">
        <div>
          <label className="mb-1.5 block font-body text-xs text-bark/60">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-canopy-700 bg-canopy-950 px-3.5 py-2.5 font-body text-sm text-bark focus:border-mint-500 focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-xs text-bark/60">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-canopy-700 bg-canopy-950 px-3.5 py-2.5 font-body text-sm text-bark focus:border-mint-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-body text-xs text-bark/60">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-canopy-700 bg-canopy-950 px-3.5 py-2.5 font-body text-sm text-bark focus:border-mint-500 focus:outline-none"
            placeholder="At least 6 characters"
          />
        </div>
        {error && <p className="font-body text-sm text-amber-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-500 px-4 py-2.5 font-body text-sm font-semibold text-canopy-950 transition hover:bg-mint-400 disabled:opacity-50"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          Sign up
        </button>
      </form>

      <p className="mt-5 text-center font-body text-sm text-bark/60">
        Already have an account?{" "}
        <Link to="/login" className="text-mint-400 hover:text-mint-300">
          Log in
        </Link>
      </p>
    </div>
  );
}
