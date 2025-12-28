import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Instructions have been sent to: " + email);
    navigate('/'); 
  };

  return (
    
    <div className={styles.pageWrapper}> 
      <div className={styles.authCard}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className={styles.container}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input} 
            required
          />
          
          <button type="submit" className={styles.submitButton}>
            Send Reset Link
          </button>
        </form>

        <button 
          onClick={() => navigate('/')} 
          className={styles.backButton}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;