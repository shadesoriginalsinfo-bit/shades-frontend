import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import { Toaster } from "react-hot-toast";
import Unauthorized from "./pages/Unauthorized";
import NotFoundPage from "./pages/not-found/NotFoundPage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <Router>

      <ScrollToTop />
      <Toaster />

      <Routes>
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /> */}

        {/* <Route element={<ProtectedRoute />}> */}
          {/* <Route element={<DashboardLayout />}> */}
            <Route path="/" element={<HomePage />} />
            

            {/* admins page access just by MASTERADMIN */}
            {/* <Route element={<ProtectedRoute allowedRoles={[Role.MASTERADMIN]} />}>
              <Route path="/admins" element={<AdminPage />} />
              <Route path="/admins/:id" element={<AdminDetailPage />} />
            </Route> */}

          {/* </Route> */}
        {/* </Route> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App