// import React from 'react'
// import { Routes, Route } from 'react-router-dom'
// import LandingPage from './components/LandingPage'
// import GeneratorPage from './components/GeneratorPage'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/generator" element={<GeneratorPage />} />
//     </Routes>
//   )
// }

// export default App

import { Routes, Route} from "react-router-dom";
import LandingPage from './components/LandingPage'
import Login from "./pages/Login";
import Register from "./pages/Register";
import GeneratorPage from "./components/GeneratorPage";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute";

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