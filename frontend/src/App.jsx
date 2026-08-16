import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Scan from "./pages/Scan.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyGarden from "./pages/MyGarden.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-canopy-950 bg-vein-pattern font-body text-bark">
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <Scan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/garden"
              element={
                <ProtectedRoute>
                  <MyGarden />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <footer className="mx-auto max-w-6xl px-6 py-10 text-center font-mono text-xs text-bark/40">
          PlantSathi AI — Final Year Project · Built with React, Node.js, Python & open AI APIs
        </footer>
      </div>
    </AuthProvider>
  );
}
