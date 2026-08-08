import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Properties from "./pages/Properties";
import AddProperty from "./pages/AddProperty";
import Favorites from "./pages/Favorites";
import MyProperties from "./pages/MyProperties";
import Navbar from "./components/Navbar"; 
import PropertyDetails from "./pages/PropertyDetails";
import EditProperty from "./pages/EditProperty";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/properties" element={<Properties />} />
        <Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route
  path="/add-property"
  element={
    <ProtectedRoute>
      <AddProperty />
    </ProtectedRoute>
  }
/>
        <Route
  path="/favorites"
  element={
    <ProtectedRoute>
      <Favorites />
    </ProtectedRoute>
  }
/>
        <Route
  path="/my-properties"
  element={
    <ProtectedRoute>
      <MyProperties />
    </ProtectedRoute>
  }
/>
        <Route
  path="/edit-property/:id"
  element={
    <ProtectedRoute>
      <EditProperty />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users"
  element={<AdminUsers />}
/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
