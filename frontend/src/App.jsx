import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ToolPage from "./pages/ToolPage";
import HistoryPage from "./pages/HistoryPage";
import PricingPage from "./pages/PricingPage";
import SuccessPage from "./pages/SuccessPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tool/:toolId"
          element={
            <PrivateRoute>
              <ToolPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <HistoryPage />
            </PrivateRoute>
          }
        />
        <Route path="/pricing" element={<PricingPage />} />
        <Route
          path="/success"
          element={
            <PrivateRoute>
              <SuccessPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
