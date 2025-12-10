import React from "react";
import styles from './AuthForm.module.css';

const AuthForm = ({ form, onChange }) => (
  <div className={styles.container}>
    <input
      name="username"
      placeholder="Username"
      value={form.username}
      onChange={onChange}
      className={styles.input}
    />
    <input
      name="password"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={onChange}
      className={styles.input}
    />
  </div>
);

export default AuthForm;
