import React, { useState } from 'react';

// columns: [{ key, label, filterable }]
// data: array of row objects matching column keys
export default function DataTable({ columns, data, onFilterChange, sortKey, sortOrder, onSortChange }) {
  const [filters, setFilters] = useState({});

  const handleFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange && onFilterChange(next);
  };

  const handleSort = (key) => {
    if (!onSortChange) return;
    const nextOrder = sortKey === key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSortChange(key, nextOrder);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-panel">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-medium text-gray-300">
                <button
                  type="button"
                  onClick={() => handleSort(col.key)}
                  className="flex items-center gap-1 hover:text-white"
                >
                  {col.label}
                  {sortKey === col.key && <span>{sortOrder === 'ASC' ? '▲' : '▼'}</span>}
                </button>
                {col.filterable && (
                  <input
                    type="text"
                    placeholder={`Filter ${col.label.toLowerCase()}`}
                    className="mt-2 w-full rounded px-2 py-1 text-xs"
                    onChange={(e) => handleFilter(col.key, e.target.value)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                No results found.
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t border-border hover:bg-panel/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-200">
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
