import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then(({ data }) => setUser(data));
  }, [id]);

  if (!user) return <div className="px-6 py-8 text-gray-400">Loading…</div>;

  return (
    <div className="mx-auto mt-10 max-w-md px-4">
      <Link to="/admin/users" className="mb-4 inline-block text-sm text-indigo-400 hover:underline">
        ← Back to users
      </Link>
      <div className="rounded-xl border border-border bg-panel p-6">
        <h1 className="mb-4 text-xl font-semibold text-white">{user.name}</h1>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-gray-400">Email</dt><dd className="text-gray-200">{user.email}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Address</dt><dd className="text-gray-200">{user.address}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-400">Role</dt><dd className="text-gray-200">{user.role}</dd></div>
          {user.role === 'STORE_OWNER' && (
            <div className="flex justify-between"><dt className="text-gray-400">Store rating</dt><dd className="text-gray-200">{user.rating ?? '—'}</dd></div>
          )}
        </dl>
      </div>
    </div>
  );
}
