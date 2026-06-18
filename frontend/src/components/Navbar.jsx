import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = {
    ADMIN: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' },
    ],
    USER: [{ to: '/stores', label: 'Stores' }],
    STORE_OWNER: [{ to: '/owner', label: 'Dashboard' }],
  };

  return (
    <nav className="flex items-center justify-between border-b border-border bg-panel px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-semibold text-indigo-400">Roxiler Ratings</span>
        {(links[user.role] || []).map((link) => (
          <Link key={link.to} to={link.to} className="text-sm text-gray-300 hover:text-white">
            {link.label}
          </Link>
        ))}
        <Link to="/update-password" className="text-sm text-gray-300 hover:text-white">
          Change password
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{user.name} · {user.role}</span>
        <button
          onClick={handleLogout}
          className="rounded bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
