import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import DataTable from '../../components/DataTable.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [roleFilter, setRoleFilter] = useState('');

  const load = async () => {
    const { data } = await api.get('/admin/users', {
      params: { ...filters, role: roleFilter || undefined, sortBy: sortKey, order: sortOrder },
    });
    setUsers(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortKey, sortOrder, roleFilter]);

  const columns = [
    { key: 'name', label: 'Name', filterable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'address', label: 'Address', filterable: true },
    { key: 'role', label: 'Role' },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (row.role === 'STORE_OWNER' ? row.rating ?? '—' : '—'),
    },
    {
      key: 'view',
      label: '',
      render: (row) => (
        <Link to={`/admin/users/${row.id}`} className="text-indigo-400 hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Users</h1>
        <Link to="/admin/users/new" className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          + Add user
        </Link>
      </div>

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="mb-4 rounded px-3 py-2 text-sm"
      >
        <option value="">All roles</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">Normal user</option>
        <option value="STORE_OWNER">Store owner</option>
      </select>

      <DataTable
        columns={columns}
        data={users}
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
