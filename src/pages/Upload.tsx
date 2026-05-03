import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload as UploadIcon, FileUp, Loader2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('file', file);

    setLoading(true);
    try {
      await axios.post('/api/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Note uploaded successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="glass rounded-[2.5rem] p-10 md:p-14">
          <div className="mb-10 text-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <UploadIcon size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-50 tracking-tight mb-3">Publish Resource</h1>
            <p className="text-slate-500 font-medium">Contribute to the world's most high-quality study library.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Document Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Advanced Quantum Field Theory Notes"
                  required
                  className="w-full px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-slate-100 placeholder:text-slate-600"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Subject Area</label>
                <input 
                  type="text"
                  placeholder="e.g. Theoretical Physics"
                  required
                  className="w-full px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold text-slate-100 placeholder:text-slate-600"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">PDF Document</label>
              <div className="relative">
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full h-56 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2rem] cursor-pointer hover:bg-slate-800/40 hover:border-blue-500/40 transition-all group overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                      <FileUp className="text-slate-600 mb-4 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-300" size={48} />
                      <p className="mb-1 text-sm text-slate-100 font-bold">Standard PDF Upload</p>
                      <p className="text-xs text-slate-500 font-medium">Click to browse or drag your file here</p>
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf"
                      className="hidden" 
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-5 bg-blue-500/5 border border-blue-500/20 rounded-[1.5rem]">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-600 p-3 rounded-xl text-white">
                        <FileUp size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-100 truncate max-w-[220px]">{file.name}</p>
                        <p className="text-xs text-blue-400 font-bold uppercase tracking-tighter">{(file.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFile(null)}
                      className="p-3 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-400 transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-2xl shadow-blue-900/30 transition-all disabled:opacity-50 flex items-center justify-center space-x-3 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <UploadIcon size={20} />
                  <span>Begin Upload</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
