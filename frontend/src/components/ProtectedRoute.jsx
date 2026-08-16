import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-mint-400" size={24} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
