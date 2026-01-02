import { Routes, Route } from "react-router-dom";
import AccessGate from "@/components/AccessGate";
import PrivateRoute from "@/components/PrivateRoute";
import AuthPanel from "@/components/AuthPanel";
import Header from "@/components/Layout/Header/Header";
import Footer from "@/components/Layout/Footer/Footer";

import HomePage from "@/pages/HomePage";
import DashboardPage from "@/pages/DashboardPage";
import Playground from "@/pages/Playground";
import TicketDetailsPage from "@/pages/TicketDetailsPage";
import CreateTicket from "@/components/Tickets/CreateTicketForm";
import ForgotPassword from "@/components/AuthForm/ForgotPassword";

// --- ΠΡΟΣΘΗΚΗ: Κάνε Import το CustomerRequests ---
// Βεβαιώσου ότι το path είναι σωστό (π.χ. αν το έβαλες στο φάκελο pages/customer/)
import CustomerRequests from "@/components/Dashboard/CustomerRequests"; 

function App() {
  return (
    <>
      <Header />
      <AccessGate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPanel />} />          
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* 1. DASHBOARD: Αυτό φορτώνει το DashboardPage -> που διαλέγει το CustomerDashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* 2. MY REQUESTS: Αυτό πρέπει να φορτώνει ΑΠΕΥΘΕΙΑΣ το CustomerRequests */}
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <CustomerRequests />
              </PrivateRoute>
            }
          />

          {/* Αφαίρεσα το διπλό route "/requests" που είχες, κρατάμε μόνο το "/my-requests" */}

          <Route
            path="/create-ticket"
            element={
              <PrivateRoute>
                <CreateTicket />
              </PrivateRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute>
                <TicketDetailsPage />
              </PrivateRoute>
            }
          />

          {/* DEVELOPMENT ONLY ROUTE */}
          <Route path="/test" element={<Playground />} />
        </Routes>
      </AccessGate>
      <Footer />
    </>
  );
}

export default App;