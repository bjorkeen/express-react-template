import AuthPanel from '../components/AuthPanel';

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="panel">
        <h1>Secure Auth Boilerplate (React + Express)</h1>
        <p className="text-gray-600 dark:text-gray-300">
              Built with React + Express, styled with Tailwind.
            </p>
        <AuthPanel />
      </div>
    </div>
  );
};

export default HomePage;
