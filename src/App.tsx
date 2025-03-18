import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Pagecon from "./page/Pagecon";
import React from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import { PremiumBanner } from "./components/PremiumBanner";
import { useAuth } from "@clerk/clerk-react";
import Register from "./components/RegisterUser";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Protected route for authenticated users
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <div>Loading...</div>; // Prevent redirect until auth state is confirmed
  return isSignedIn ? children : <Navigate to="/login" replace />;
}

// Route for unauthenticated users (login/register)
// function UnauthenticatedRoute({ children }) {
//   const { isSignedIn } = useAuth();
//   return isSignedIn ? <Navigate to="/" replace /> : children;
// }

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Pagecon />
              </ProtectedRoute>
            }
          />

          {/* Unauthenticated routes */}
          <Route
            path="/login"
            element={
              // <UnauthenticatedRoute>
                <Login />
              // </UnauthenticatedRoute>
            }
          />
          <Route
            path="/register"
            element={
              // <UnauthenticatedRoute>
                <Register />
              // </UnauthenticatedRoute>
            }
          />

          {/* Public routes */}
          <Route path="/subscription" element={<PremiumBanner />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;