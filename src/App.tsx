import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";
import { AppStateProvider } from "@/store/app-state";
import { RequireAuth } from "@/components/auth/RequireAuth";
import AdminDashboard from "./pages/AdminDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ApplicantDocuments from "./pages/ApplicantDocuments";

import Proforma1Applicant from "./pages/proformas/Proforma1Applicant";
import Proforma2Company from "./pages/proformas/Proforma2Company";
import Proforma3Admin from "./pages/proformas/Proforma3Admin";
import Proforma4Admin from "./pages/proformas/Proforma4Admin";
import Proforma5Admin from "./pages/proformas/Proforma5Admin";
import Proforma6Admin from "./pages/proformas/Proforma6Admin";
import InvitationLetterAdmin from "./pages/proformas/InvitationLetterAdmin";
import UndertakingAdmin from "./pages/proformas/UndertakingAdmin";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AppStateProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/admin"
                element={
                  <RequireAuth role="admin">
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/company/:id"
                element={
                  <RequireAuth role="company" enforceIdMatchFromParam>
                    <CompanyDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/applicant/:id"
                element={
                  <RequireAuth role="applicant" enforceIdMatchFromParam>
                    <ApplicantDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/applicant/:id/documents"
                element={
                  <RequireAuth role="applicant" enforceIdMatchFromParam>
                    <ApplicantDocuments />
                  </RequireAuth>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppStateProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
