// src/App.jsx
import { Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage'
import Login from "./pages/Login";
import Register from "./pages/Register";
import GeneratorPage from "./components/GeneratorPage";
import History from "./pages/History";
import BenchmarkDashboardPage from "./pages/BenchmarkDashboardPage"; // Add this import

import ProtectedRoute from "./components/ProtectedRoute";
import ImageTo3DPage from "./components/ImageTo3DPage";

function App() {

  return (
    
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Generator */}
        <Route
          path="/generator"
          element={
            <ProtectedRoute>
              <GeneratorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/image-to-3d"
          element={
            <ProtectedRoute>
              <ImageTo3DPage />
            </ProtectedRoute>
          }
        />

        {/* NEW: Protected Benchmark Dashboard */}
        <Route
          path="/benchmark"
          element={
            <ProtectedRoute>
              <BenchmarkDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Protected History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

      </Routes>
  );
}

export default App;