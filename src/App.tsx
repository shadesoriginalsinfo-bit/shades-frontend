import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import Unauthorized from "./pages/Unauthorized";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import { Role } from "./types/enum";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import DashboardPage from "./pages/admin/dashboard";
import OrdersPage from "./pages/admin/orders";
import UsersPage from "./pages/admin/users";
import ProductsPage from "./pages/admin/products";
import ShopPage from "./pages/shop";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";

function App() {
  return (
    <Router>

      <ScrollToTop />
      <Toaster />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        <Route element={<ProtectedRoute />}>
            {/* <Route path="/cart" element={<CartPage />} /> */}
            {/* <Route path="/my-profile" element={<MyProfile />} /> */}
            
          <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
            <Route element={<AdminDashboardLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App