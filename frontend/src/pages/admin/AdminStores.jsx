import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import DataTable from '../../components/DataTable.jsx';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/admin/stores', { params: { ...filters, sortBy: sortKey, order: sortOrder } });
    setStores(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortKey, sortOrder]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, ownerId: form.ownerId || undefined };
      await api.post('/admin/stores', payload);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create store');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'address', label: 'Address', filterable: true },
    { key: 'rating', label: 'Rating', render: (row) => row.rating ?? '—' },
  ];

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Stores</h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          {showForm ? 'Cancel' : '+ Add store'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-border bg-panel p-6">
          {error && <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Store name (20–60 chars)</label>
              <input value={form.name} onChange={handleChange('name')} className="w-full rounded px-3 py-2" />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <input type="email" value={form.email} onChange={handleChange('email')} className="w-full rounded px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-gray-300">Address (max 400 chars)</label>
              <textarea value={form.address} onChange={handleChange('address')} className="w-full rounded px-3 py-2" rows={2} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">Owner user ID (optional)</label>
              <input value={form.ownerId} onChange={handleChange('ownerId')} placeholder="UUID of a STORE_OWNER user" className="w-full rounded px-3 py-2" />
            </div>
          </div>
          <button type="submit" className="mt-4 rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Save store
          </button>
        </form>
      )}

      <DataTable
        columns={columns}
        data={stores}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={(key, order) => {
          setSortKey(key);
          setSortOrder(order);
        }}
        onFilterChange={setFilters}
      />
    </div>
  );
}
