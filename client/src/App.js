import React, { useMemo } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import EmailVerify from "./pages/EmailVerify";
import Reset from "./pages/Reset"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQList from "./pages/FAQList";
import AddFAQ from "./pages/AddFAQ";
import EditFAQ from "./pages/EditFAQ";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NotFoundPage from "./pages/NotFoundPage"; 
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext";
import { useAuth } from "./context/AuthContext";

//  Protected Route Wrapper
const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Checking authentication...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  const location = useLocation();

  const shouldShowNavbar = useMemo(() => {
    const hideNavbarRoutes = ["/login", "/register", "/email-verify", "/reset-password"];
    return !hideNavbarRoutes.includes(location.pathname);
  }, [location.pathname]);

  return (
    <LanguageProvider>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/*  Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<Reset />} /> 

        {/*  Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq-list" element={<FAQList />} />
          <Route path="/add-faq" element={<AddFAQ />} />
          <Route path="/edit-faq/:id" element={<EditFAQ />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LanguageProvider>
  );
};

export default App;
