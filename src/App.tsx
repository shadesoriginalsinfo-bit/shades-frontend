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
import SettingsPage from "./pages/admin/settings";
import MediaPage from "./pages/admin/media";
import PromoItemsPage from "./pages/admin/promo-items";
import CouponsPage from "./pages/admin/coupons";
import ShopPage from "./pages/shop";
import ProductDetailPage from "./pages/product-detail/ProductDetailPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderSuccessPage from "./pages/order-success/OrderSuccessPage";
import MyProfile from "./pages/my-profile";
import HelpPage from "./pages/help/HelpPage";
import CartPage from "./pages/cart/CartPage";
import CartFloatingBar from "./components/CartFloatingBar";

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
        <Route path="/help" element={<HelpPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/my-profile" element={<MyProfile />} />

          <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
            <Route element={<AdminDashboardLayout />}>
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              <Route path="/admin/media" element={<MediaPage />} />
              <Route path="/admin/promo-items" element={<PromoItemsPage />} />
              <Route path="/admin/coupons" element={<CouponsPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CartFloatingBar />
    </Router>
  )
}

export default App