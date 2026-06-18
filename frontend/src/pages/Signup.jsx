import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = { name: '', email: '', address: '', password: '' };

function validate(form) {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) {
    errors.name = 'Name must be between 20 and 60 characters';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (form.address.length === 0 || form.address.length > 400) {
    errors.address = 'Address must be 1–400 characters';
  }
  if (form.password.length < 8 || form.password.length > 16) {
    errors.password = 'Password must be 8–16 characters';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Password must contain an uppercase letter';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
    errors.password = 'Password must contain a special character';
  }
  return errors;
}

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setServerError('');
    try {
      await register(form);
      navigate('/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not create account');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-border bg-panel p-8">
        <h1 className="mb-6 text-xl font-semibold text-white">Create your account</h1>

        {serverError && <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{serverError}</p>}

        <label className="mb-1 block text-sm text-gray-300">Full name</label>
        <input value={form.name} onChange={handleChange('name')} className="mb-1 w-full rounded px-3 py-2" />
        {errors.name && <p className="mb-3 text-xs text-red-400">{errors.name}</p>}

        <label className="mb-1 block text-sm text-gray-300">Email</label>
        <input type="email" value={form.email} onChange={handleChange('email')} className="mb-1 w-full rounded px-3 py-2" />
        {errors.email && <p className="mb-3 text-xs text-red-400">{errors.email}</p>}

        <label className="mb-1 block text-sm text-gray-300">Address</label>
        <textarea value={form.address} onChange={handleChange('address')} className="mb-1 w-full rounded px-3 py-2" rows={2} />
        {errors.address && <p className="mb-3 text-xs text-red-400">{errors.address}</p>}

        <label className="mb-1 block text-sm text-gray-300">Password</label>
        <input type="password" value={form.password} onChange={handleChange('password')} className="mb-1 w-full rounded px-3 py-2" />
        {errors.password && <p className="mb-3 text-xs text-red-400">{errors.password}</p>}

        <button type="submit" className="mt-4 w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500">
          Sign up
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
