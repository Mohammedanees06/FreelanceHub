import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Loader from "./components/common/Loader";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobsPage from "./pages/JobsPage";
import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./utils/PrivateRoute";
import { setUser } from "./redux/slices/authSlice";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import JobDetails from "./pages/JobDetails";
import ApplicationsPage from "./pages/ApplicationsPage";
import AppliedJobs from "./pages/AppliedJobs";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (
        storedUser &&
        storedToken &&
        storedUser !== "undefined" &&
        storedUser !== "null"
      ) {
        try {
          const parsedUser = JSON.parse(storedUser);
          await dispatch(setUser(parsedUser));
        } catch (error) {
          console.error("Error parsing user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className="flex-grow" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />

          {/* Dashboard route - shows AdminDashboard for admin, regular Dashboard for others */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <AdminDashboard /> : <Dashboard />}
              </PrivateRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <PrivateRoute>
                <AppliedJobs />
              </PrivateRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobsPage />
              </PrivateRoute>
            }
          />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Only employer and admin can add jobs */}
          <Route
            path="/add-job"
            element={
              <PrivateRoute allowedRoles={["employer", "admin"]}>
                <AddJobPage />
              </PrivateRoute>
            }
          />

          {/* Only employer and admin can edit jobs */}
          <Route
            path="/jobs/edit/:id"
            element={
              <PrivateRoute allowedRoles={["employer", "admin"]}>
                <EditJobPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <PrivateRoute allowedRoles={["employer", "admin"]}>
                <ApplicationsPage />{" "}
              </PrivateRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
