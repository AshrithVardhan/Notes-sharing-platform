import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function StudyTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="glass rounded-[2rem] p-8 border-blue-500/10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
          <Timer size={18} />
        </div>
        <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Study Session</h4>
      </div>
      
      <div className="text-center mb-8">
        <div className="text-6xl font-black text-slate-50 tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest font-mono">Focus Time</p>
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleTimer}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-bold transition-all shadow-lg ${
            isActive 
            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {isActive ? <Pause size={18} /> : <Play size={18} />}
          <span>{isActive ? 'Pause' : 'Start Focus'}</span>
        </button>
        <button 
          onClick={resetTimer}
          className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
