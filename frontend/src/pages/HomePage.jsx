import AuthPanel from '../components/AuthPanel';

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="logo-area">
        <h1>Electronics R&R</h1>
        <p>Returns & Repairs Management</p>
      </div>

      <AuthPanel />
    </div>
  );
};

export default HomePage;