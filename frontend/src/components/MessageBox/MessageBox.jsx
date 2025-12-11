import styles from './MessageBox.module.css';

const MessageBox = ({ message }) => {
  if (!message) return null;
  return (
    <div className={styles.box}>
      {message}
    </div>
  );
};

export default MessageBox;