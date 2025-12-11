const ProtectedPage = () => {
  return (
    <div className="page-container">
      <div className="panel">
        <h2>Protected Page</h2>
        <p>Only visible if you’re authenticated. Safeguarded by ProtectedRoute.</p>
      </div>
    </div>
  );
};

export default ProtectedPage;
