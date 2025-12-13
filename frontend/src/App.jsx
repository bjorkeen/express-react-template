import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import AccessGate from './components/AccessGate';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import AuthPanel from './components/AuthPanel';
import ProtectedPage from './pages/ProtectedPage';

import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <>
      <Header />
      <AccessGate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPanel />} />
          
          {/* Protected Routes */}
          <Route path="/protected" element={
            <PrivateRoute>
              <ProtectedPage />
            </PrivateRoute>
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MyTickets />
            </PrivateRoute>
          } />

          <Route path="/create-ticket" element={
            <PrivateRoute>
              <CreateTicket />
            </PrivateRoute>
          } />
          
        </Routes>
      </AccessGate>
    </>
  );
}

export default App;