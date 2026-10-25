import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SignInPage } from "@/pages/sign-in";
import { DashboardPage } from "@/pages/dashboard";

function RequireAuth({ children }: { children: React.ReactNode }) {
  // TODO: proper auth state/session handling once provider is decided
  if (!localStorage.getItem("sm_token")) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
