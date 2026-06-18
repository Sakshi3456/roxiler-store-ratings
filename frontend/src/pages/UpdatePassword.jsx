import React, { useState } from 'react';
import api from '../api/axios.js';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const { data } = await api.patch('/auth/update-password', { oldPassword, newPassword });
      setMessage(data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    }
  };

  return (
    <div className="mx-auto mt-12 max-w-md px-4">
      <h1 className="mb-6 text-xl font-semibold text-white">Change password</h1>
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-panel p-6">
        {message && <p className="mb-4 rounded bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{message}</p>}
        {error && <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

        <label className="mb-1 block text-sm text-gray-300">Current password</label>
        <input
          type="password"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mb-4 w-full rounded px-3 py-2"
        />

        <label className="mb-1 block text-sm text-gray-300">New password</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mb-1 w-full rounded px-3 py-2"
        />
        <p className="mb-4 text-xs text-gray-500">8–16 characters, at least one uppercase letter and one special character.</p>

        <button type="submit" className="w-full rounded bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500">
          Update password
        </button>
      </form>
    </div>
  );
}
