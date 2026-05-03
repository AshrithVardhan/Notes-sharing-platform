import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', { name, email, password });
      login(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#020617] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full -ml-32 -mb-32" />

      <div className="w-full max-w-lg glass rounded-[2.5rem] p-12 relative z-10 shadow-2xl border-white/5">
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center justify-center font-black text-3xl text-white">
            N
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight">Join Network</h1>
          <p className="text-slate-500 mt-3 font-medium">Be part of the global knowledge collective</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Full name"
                required
                className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-slate-100 placeholder:text-slate-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-slate-100 placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password"
                placeholder="Password"
                required
                className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-slate-100 placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-900/20 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <span>Create Account</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-sm text-slate-500 font-bold tracking-wide">
          ALREADY A MEMBER? {' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4">LOGIN</Link>
        </p>
      </div>
    </div>
  );
}
