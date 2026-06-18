import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import RatingStars from '../../components/RatingStars.jsx';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');

  const load = async () => {
    const { data } = await api.get('/stores', { params: { search } });
    setStores(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const submitRating = async (storeId, value) => {
    await api.post(`/stores/${storeId}/rating`, { value });
    load();
  };

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-white">Stores</h1>

      <input
        type="text"
        placeholder="Search by name or address…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full max-w-sm rounded px-3 py-2"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div key={store.id} className="rounded-xl border border-border bg-panel p-5">
            <h2 className="font-medium text-white">{store.name}</h2>
            <p className="mt-1 text-sm text-gray-400">{store.address}</p>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-400">Overall: {store.overallRating ?? 'No ratings yet'}</span>
            </div>

            <div className="mt-3">
              <p className="mb-1 text-xs text-gray-500">
                {store.userRating ? 'Your rating (tap to change)' : 'Tap to rate'}
              </p>
              <RatingStars value={store.userRating || 0} onChange={(value) => submitRating(store.id, value)} />
            </div>
          </div>
        ))}
        {stores.length === 0 && <p className="text-gray-500">No stores found.</p>}
      </div>
    </div>
  );
}
