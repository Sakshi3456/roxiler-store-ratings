import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios.js';

const initialForm = { name: '', email: '', address: '', password: '', role: 'USER' };

export default function AddUser() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user');
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <h1 className="mb-6 text-xl font-semibold text-white">Add user</h1>
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-panel p-6">
        {error && <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{Array.isArray(error) ? error.join(', ') : error}</p>}

        <label className="mb-1 block text-sm text-gray-300">Name (20–60 chars)</label>
        <input value={form.name} onChange={handleChange('name')} className="mb-4 w-full rounded px-3 py-2" />

        <label className="mb-1 block text-sm text-gray-300">Email</label>
        <input type="email" value={form.email} onChange={handleChange('email')} className="mb-4 w-full rounded px-3 py-2" />

        <label className="mb-1 block text-sm text-gray-300">Address (max 400 chars)</label>
        <textarea value={form.address} onChange={handleChange('address')} className="mb-4 w-full rounded px-3 py-2" rows={2} />

        <label className="mb-1 block text-sm text-gray-300">Password (8–16, 1 uppercase, 1 special char)</label>
        <input type="password" value={form.password} onChange={handleChange('password')} className="mb-4 w-full rounded px-3 py-2" />

        <label className="mb-1 block text-sm text-gray-300">Role</label>
        <select value={form.role} onChange={handleChange('role')} className="mb-6 w-full rounded px-3 py-2">
          <option value="USER">Normal user</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store owner</option>
        </select>

        <button type="submit" className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500">
          Create user
        </button>
      </form>
    </div>
  );
}
