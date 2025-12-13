import React from "react";
import styles from "./AuthForm.module.css";

const AuthForm = ({ form, onChange, mode, onSubmit }) => (
  <form className={styles.container} onSubmit={onSubmit}>
    {mode === "register" && (
      <input
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={form.fullName}
        onChange={onChange}
        className={styles.input}
        required
      />
    )}
    <input
      name="username"
      type="email"
      placeholder="Email Address"
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
  <button type="submit" style={{ display: 'none' }}></button>
  </form>
);

export default AuthForm;
