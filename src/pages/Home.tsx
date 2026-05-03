import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import NoteCard from '../components/NoteCard';
import { Search, Loader2, BookText } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const subjects = ['All', 'Mathematics', 'Computer Science', 'Physics', 'History', 'Biology', 'Chemistry'];

  const fetchNotes = async (searchTerm = '', subject = 'All') => {
    try {
      setLoading(true);
      setErrorMsg(null);
      let url = `/api/notes?search=${searchTerm}`;
      const res = await axios.get(url);
      let data = Array.isArray(res.data) ? res.data : [];
      
      if (subject !== 'All') {
        data = data.filter((n: any) => n.subject === subject);
      }
      
      setNotes(data);
    } catch (error: any) {
      console.error('Error fetching notes', error);
      const msg = error.response?.data?.details || error.response?.data?.message || 'Failed to connect to the library server.';
      setErrorMsg(msg);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/notes/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  };

  useEffect(() => {
    fetchNotes(search, selectedSubject);
    fetchStats();
  }, [selectedSubject]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes(search, selectedSubject);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="flex gap-3 mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/10">Library</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">Most Popular</span>
            </div>
            <h1 className="text-4xl font-black text-slate-50 tracking-tight mb-2">Explore Library</h1>
            <p className="text-slate-400 font-medium">Discover and share high-quality study materials from around the world.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search for notes, subjects or authors..."
              className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-slate-100 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Subject Categories</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {subjects.map((sub) => (
                  <motion.button
                    key={sub}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left flex items-center justify-between ${
                      selectedSubject === sub 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent hover:border-slate-700/50'
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubject === sub && <motion.div layoutId="activeSubject" className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-[1.5rem] border-blue-500/10">
              <h4 className="text-sm font-black text-indigo-300 mb-4 uppercase tracking-tighter">Library Overview</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Notes</span>
                  <span className="text-lg font-black text-slate-200">{stats?.totalNotes || '0'}</span>
                </div>
                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Subjects</span>
                  <span className="text-lg font-black text-slate-200">{stats?.subjectCount || '0'}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-4">Our community is growing. Contribute your knowledge to help fellow students.</p>
              <button className="w-full py-3 bg-slate-800 text-xs font-black text-slate-300 rounded-xl hover:bg-slate-700 transition-colors">Join Community</button>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="animate-spin text-blue-600" size={48} />
              </div>
            ) : errorMsg ? (
              <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem] border-red-500/30 text-center px-6">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Connection Issue</h2>
                <p className="text-slate-400 font-medium max-w-md mx-auto">{errorMsg}</p>
                <button 
                  onClick={() => fetchNotes(search, selectedSubject)}
                  className="mt-8 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              <>
                {notes.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {notes.map((note: any) => (
                      <NoteCard key={note._id} note={note} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 glass rounded-[2.5rem] border-dashed">
                    <BookText size={48} className="text-slate-700 mb-4" />
                    <span className="text-slate-400 font-bold text-lg">No resources found for "{selectedSubject}".</span>
                    <p className="text-slate-500 mt-1">Try a different subject or be the first to upload!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
