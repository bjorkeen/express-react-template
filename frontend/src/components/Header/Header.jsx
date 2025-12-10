import { Link } from 'react-router-dom';
import styles from './Header.module.css'; // Import Styles

const Header = ({ hasAccess }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>Home</Link>
          {hasAccess && (
            <Link to="/protected" className={`${styles.link} ${styles.linkProtected}`}>
              Protected
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;