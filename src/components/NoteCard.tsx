import { Link } from 'react-router-dom';
import { FileText, Heart, MessageSquare, User, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoteCardProps {
  note: {
    _id: string;
    title: string;
    subject: string;
    uploadedBy: { name: string; email: string };
    likes: string[];
    comments: any[];
    createdAt: string;
  };
}

export default function NoteCard({ note }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: "rgba(59, 130, 246, 0.5)" }}
      className="glass rounded-2xl p-6 flex flex-col space-y-4 transition-all hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_0_15px_rgba(59,130,246,0.1)] group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center font-extrabold text-[10px] text-white shadow-lg shadow-red-500/20">
          PDF
        </div>
        <span className="text-[10px] font-bold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full uppercase tracking-widest">
          {note.subject}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-slate-100 leading-tight mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
          {note.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium capitalize">
          {note.subject} • Note Pack
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Shared By
          </span>
          <span className="text-xs font-semibold text-slate-300">{note.uploadedBy.name}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-white transition-colors">
          <Heart size={14} className="group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
          <span className="text-xs font-bold">{(note.likes || []).length}</span>
        </div>
      </div>
      
      <Link 
        to={`/note/${note._id}`}
        className="absolute inset-0 z-0"
      />
    </motion.div>
  );
}
