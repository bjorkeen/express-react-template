import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProtectedPage from './pages/ProtectedPage';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { AccessProvider, useAccess } from './context/AccessContext';
import AccessGate from './components/AccessGate';

const App = () => (
  <AccessProvider>
    <Router>
      <AccessGate>
        <AppContent />
      </AccessGate>
    </Router>
  </AccessProvider>
);

const AppContent = () => {
  const { hasAccess } = useAccess();

  return (
    <>
      <Header hasAccess={hasAccess} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/protected" element={<PrivateRoute><ProtectedPage /></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default App;
