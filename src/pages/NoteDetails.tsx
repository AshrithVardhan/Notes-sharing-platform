import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, MessageSquare, User, Clock, Download, ExternalLink, Send, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import StudyTimer from '../components/StudyTimer';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function NoteDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [note, setNote] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [relatedNotes, setRelatedNotes] = useState<any[]>([]);

  const fetchNote = async () => {
    try {
      const res = await axios.get(`/api/notes/${id}`);
      setNote(res.data);
      
      // Fetch related notes (same subject)
      const relatedRes = await axios.get(`/api/notes?search=${res.data.subject}`);
      setRelatedNotes(relatedRes.data.filter((n: any) => n._id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error fetching note', error);
      toast.error('Could not load note details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  const handleLike = async () => {
    if (!user) return toast.error('Please login to like');
    try {
      const res = await axios.post(`/api/notes/${id}/like`);
      setNote(res.data);
    } catch (error) {
      toast.error('Failed to like');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`/api/notes/${id}/comment`, { text: comment });
      setNote(res.data);
      setComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!note) return <div>Note not found</div>;

  const isLiked = user && (note.likes || []).includes(user.id);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass rounded-[2rem] p-10">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">{note.subject}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-500/10 px-4 py-1.5 rounded-full border border-slate-500/20">University Tier</span>
                  </div>
                  <h1 className="text-4xl font-black text-slate-50 tracking-tight">{note.title}</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all font-bold ${isLiked ? 'bg-red-500 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)]' : 'bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50'}`}
                  >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{(note.likes || []).length}</span>
                  </button>
                  <a 
                    href={note.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-[0_4px_15px_rgba(59,130,246,0.4)] flex items-center space-x-2 font-bold"
                  >
                    <Download size={20} />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-8 mb-10 text-sm text-slate-400 border-b border-slate-800/50 pb-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-white uppercase">
                      {note.uploadedBy.name[0]}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contributor</span>
                    <span className="font-bold text-slate-100">{note.uploadedBy.name}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/30 text-blue-400">
                    <Clock size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Published</span>
                    <span className="font-bold text-slate-100">{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="aspect-[4/5] bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-700/30 group relative mb-6">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                <iframe 
                  src={note.fileUrl} 
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              </div>

              <div className="flex justify-center">
                <a 
                  href={note.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 bg-blue-500/10 px-6 py-2 rounded-full border border-blue-500/20"
                >
                  <ExternalLink size={16} />
                  <span>Trouble viewing? Open PDF in new tab</span>
                </a>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-10">
              <h3 className="text-2xl font-black text-slate-50 mb-8 flex items-center space-x-3">
                <MessageSquare className="text-blue-500" size={24} />
                <span>Discussion ({(note.comments || []).length})</span>
              </h3>

              <form onSubmit={handleComment} className="mb-10 flex space-x-4">
                <input 
                  type="text" 
                  placeholder="Share your thoughts or ask a question..."
                  className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="bg-white text-slate-900 px-8 rounded-2xl font-black hover:bg-slate-200 transition-all disabled:opacity-50 shadow-xl"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                </button>
              </form>

              <div className="space-y-6">
                {(note.comments || []).map((c: any, i: number) => (
                  <div key={i} className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/30 hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                          {c.userName ? c.userName[0] : 'A'}
                        </div>
                        <span className="font-bold text-slate-100 text-sm">{c.userName || 'Anonymous'}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="text-2xl font-black mb-4 relative z-10">Advanced Insights</h4>
                <p className="text-blue-100 font-medium mb-8 leading-relaxed relative z-10">
                  This note belongs to the premium library segment. Share this with your colleagues or contribute to earn exclusive badges.
                </p>
                <button className="w-full py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center space-x-3 shadow-lg relative z-10">
                  <ExternalLink size={20} />
                  <span>Join Community</span>
                </button>
              </div>

              <StudyTimer />

              <div className="glass rounded-[2rem] p-8 border-dashed flex flex-col items-center text-center">
                <User size={32} className="text-slate-600 mb-4" />
                <h5 className="font-bold text-slate-300 mb-2">Want to contribute?</h5>
                <p className="text-slate-500 text-xs font-medium">Your shared knowledge helps thousands of students daily.</p>
                <Link 
                  to="/upload"
                  className="mt-6 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Post a new Resource →
                </Link>
              </div>

              {relatedNotes.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Related Resources</h4>
                  <div className="space-y-4">
                    {relatedNotes.map((rn) => (
                      <Link 
                        key={rn._id} 
                        to={`/note/${rn._id}`}
                        className="block glass p-4 rounded-2xl border-slate-800/50 hover:border-blue-500/30 transition-all group"
                      >
                        <span className="text-[10px] font-black uppercase text-blue-400 mb-1 block">{rn.subject}</span>
                        <h5 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{rn.title}</h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
