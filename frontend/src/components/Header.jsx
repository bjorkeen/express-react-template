import { Link } from 'react-router-dom';

const Header = ({ hasAccess }) => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-blue-400 transition">Home</Link>
          {hasAccess && (
            <Link to="/protected" className="hover:text-purple-400 transition">
              Protected
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
