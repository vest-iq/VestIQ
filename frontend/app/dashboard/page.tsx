import Dashboard from "./dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);
}