import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, BookText, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav flex items-center justify-between px-8 py-5 sticky top-0 z-50">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:scale-105 transition-transform">
          N
        </div>
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">NoteShare</span>
      </Link>

      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link 
              to="/upload" 
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center space-x-2"
            >
              <PlusCircle size={16} />
              <span>Upload Note</span>
            </Link>
            <div className="flex items-center space-x-4 pl-6 border-l border-slate-700/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-slate-800 shadow-xl" />
              <div className="hidden md:block">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Welcome</p>
                <p className="text-sm font-semibold text-slate-100 leading-none">{user.name}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:bg-blue-700 transition-all font-bold"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
