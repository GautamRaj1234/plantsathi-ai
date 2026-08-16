import { NavLink, useNavigate } from "react-router-dom";
import { Leaf, ScanLine, LayoutDashboard, Sprout, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/", label: "Home", icon: Leaf, end: true },
  { to: "/scan", label: "Scan", icon: ScanLine },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/garden", label: "My Garden", icon: Sprout }
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-canopy-700/60 bg-canopy-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-500/15 text-mint-400">
            <Leaf size={18} />
          </span>
          <span className="font-display text-lg tracking-tight text-bark">PlantSathi</span>
          <span className="font-display text-lg italic text-mint-400">AI</span>
        </div>
        {user && (
          <nav className="flex items-center gap-1 rounded-full border border-canopy-700 bg-canopy-900/60 p-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-body text-sm transition-colors ${
                    isActive ? "bg-mint-500/15 text-mint-400" : "text-bark/70 hover:text-bark"
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
        {user && (
          <div className="flex items-center gap-3">
            <span className="font-body text-sm text-bark/60">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-canopy-700 px-3 py-1.5 font-body text-xs text-bark/70 hover:border-amber-500/40 hover:text-amber-400"
            >
              <LogOut size={13} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
