import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index.tsx";
import Prediction from "./pages/Prediction.tsx";
import Result from "./pages/Result.tsx";
import About from "./pages/About.tsx";
import DiseaseInfo from "./pages/DiseaseInfo.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuthPage from "./pages/Auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>

                {/* PUBLIC */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/disease-info" element={<DiseaseInfo />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* PROTECTED */}
                <Route
                  path="/predict"
                  element={
                    <ProtectedRoute>
                      <Prediction />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/result"
                  element={
                    <ProtectedRoute>
                      <Result />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;