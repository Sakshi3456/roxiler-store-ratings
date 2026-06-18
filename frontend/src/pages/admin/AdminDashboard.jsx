import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  const cards = [
    { label: 'Total users', value: stats?.totalUsers },
    { label: 'Total stores', value: stats?.totalStores },
    { label: 'Total ratings submitted', value: stats?.totalRatings },
  ];

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-white">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-panel p-6">
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold text-indigo-400">
              {card.value ?? '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
