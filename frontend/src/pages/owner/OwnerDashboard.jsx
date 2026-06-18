import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/store-owner/dashboard').then(({ data }) => setData(data));
  }, []);

  if (!data) return <div className="px-6 py-8 text-gray-400">Loading…</div>;

  if (data.message) {
    return <div className="px-6 py-8 text-gray-400">{data.message}</div>;
  }

  return (
    <div className="px-6 py-8">
      <h1 className="mb-2 text-xl font-semibold text-white">{data.storeName}</h1>
      <p className="mb-6 text-sm text-gray-400">
        Average rating: <span className="text-amber-400">{data.averageRating ?? '—'}</span> · {data.totalRatings} rating{data.totalRatings === 1 ? '' : 's'}
      </p>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-panel">
            <tr>
              <th className="px-4 py-3 text-left text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-gray-300">Email</th>
              <th className="px-4 py-3 text-left text-gray-300">Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map((r, idx) => (
              <tr key={idx} className="border-t border-border">
                <td className="px-4 py-3 text-gray-200">{r.name}</td>
                <td className="px-4 py-3 text-gray-200">{r.email}</td>
                <td className="px-4 py-3 text-amber-400">{r.rating}</td>
              </tr>
            ))}
            {data.raters.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-500">No ratings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
