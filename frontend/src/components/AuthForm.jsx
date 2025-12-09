import React from 'react';

const AuthForm = ({ form, onChange }) => (
  <>
    <input
      name="username"
      placeholder="Username"
      value={form.username}
      onChange={onChange}
      className="border p-2 rounded m-1"
    />
    <input
      name="password"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={onChange}
      className="border p-2 rounded m-1"
    />
  </>
);

export default AuthForm;
