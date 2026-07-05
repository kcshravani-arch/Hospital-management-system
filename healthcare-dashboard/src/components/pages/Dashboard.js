import React, { useState, useEffect } from 'react';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // --- NEW PATIENT STATE ---
  const [newPatient, setNewPatient] = useState({ name: '', dept: '', condition: 'Stable' });

  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('pulse_config');
    return saved ? JSON.parse(saved) : {
      hospitalName: "PulsePoint Central",
      theme: "Midnight Blue",
    };
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('pulse_patients');
    return saved ? JSON.parse(saved) : [
      { id: "#PX-101", name: "Elena Gilbert", dept: "Cardiology", condition: "Stable" },
      { id: "#PX-102", name: "Marcus Vane", dept: "Neurology", condition: "Critical" }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pulse_config', JSON.stringify(config));
    localStorage.setItem('pulse_patients', JSON.stringify(patients));
  }, [config, patients]);

  const themes = {
    "Midnight Blue": { side: "bg-[#002855]", accent: "bg-[#0056b3]", text: "text-blue-500" },
    "Emerald": { side: "bg-[#064e3b]", accent: "bg-[#059669]", text: "text-emerald-500" },
    "Dark Gold": { side: "bg-[#1a1a1a]", accent: "bg-[#c5a059]", text: "text-amber-600" },
    "Slate": { side: "bg-[#1e293b]", accent: "bg-[#475569]", text: "text-slate-500" }
  };

  const style = themes[config.theme] || themes["Midnight Blue"];

  // --- HANDLERS ---
  const handleAdmit = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.dept) return;
    
    const newEntry = {
      ...newPatient,
      id: `#PX-${Math.floor(100 + Math.random() * 900)}`
    };
    
    setPatients([...patients, newEntry]);
    setNewPatient({ name: '', dept: '', condition: 'Stable' });
    setShowModal(false);
  };

  const confirmDischarge = (id, name) => {
    if (window.confirm(`Are you sure you want to discharge ${name}? This will remove them from the active terminal.`)) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      {/* SIDEBAR */}
      <aside className={`w-72 ${style.side} text-white flex flex-col p-8 fixed h-full z-40 transition-colors`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black">✚</div>
          <h1 className="text-2xl font-black tracking-tighter italic">PulsePoint</h1>
        </div>

        <button 
          onClick={() => setShowProfile(!showProfile)}
          className="mb-10 flex items-center gap-4 p-4 rounded-[2rem] bg-white/10 hover:bg-white/20 transition-all ring-1 ring-white/10"
        >
          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-blue-900 font-black">S</div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-black truncate">Shravani K C</p>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Admin</p>
          </div>
        </button>

        {showProfile && (
          <div className="absolute top-32 left-72 ml-4 w-80 bg-white rounded-[3rem] shadow-2xl border border-slate-100 z-50 p-10 text-slate-800 animate-in fade-in zoom-in-95">
            <div className="text-center border-b pb-8 mb-8">
              <div className={`${style.accent} w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-white text-3xl font-black mb-4`}>S</div>
              <h4 className="text-xl font-black italic">Shravani K C</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase">ISE Student | MSRUAS</p>
            </div>
            <div className="space-y-4 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Status</p>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[11px] font-bold text-slate-600">Active Terminal Session</p>
                <p className="text-[11px] font-bold text-blue-500">B.Tech 2nd Year Dev</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full py-4 bg-red-50 text-red-500 font-black text-xs rounded-2xl hover:bg-red-500 hover:text-white transition-all">TERMINATE</button>
          </div>
        )}

        <nav className="space-y-1">
          {['overview', 'appointments', 'settings'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left p-5 rounded-2xl capitalize font-black text-sm transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-blue-100/60 hover:text-white hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="ml-72 flex-1 p-16">
        <header className="mb-16 flex justify-between items-end">
          <div>
            <span className={`text-[10px] font-black ${style.text} uppercase tracking-[0.4em] mb-4 block`}>{config.hospitalName}</span>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter leading-none">{activeTab.toUpperCase()}</h2>
          </div>
          {activeTab === 'overview' && (
            <button 
              onClick={() => setShowModal(true)} 
              className={`${style.accent} text-white px-10 py-6 rounded-[2rem] font-black shadow-2xl hover:-translate-y-1 transition-all uppercase text-[10px] tracking-widest`}
            >
              + Admit Patient
            </button>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-6">Patient Details</th>
                  <th className="px-10 py-6">Department</th>
                  <th className="px-10 py-6">Condition</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6 font-bold text-slate-700">{p.name} <span className="block text-[10px] text-slate-300 font-mono">{p.id}</span></td>
                    <td className="px-10 py-6 text-slate-500 font-medium">{p.dept}</td>
                    <td className={`px-10 py-6 font-black text-xs uppercase ${p.condition === 'Critical' ? 'text-red-500' : 'text-emerald-500'}`}>● {p.condition}</td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => confirmDischarge(p.id, p.name)} className="text-red-300 hover:text-red-600 font-black text-[10px] uppercase">Discharge</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl">
            <h3 className="text-xl font-black mb-8 italic">System Branding</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Terminal Name</label>
                <input 
                  value={config.hospitalName} 
                  onChange={(e) => setConfig({...config, hospitalName: e.target.value})}
                  className="w-full p-5 bg-slate-50 rounded-2xl font-bold border-none ring-2 ring-transparent focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">Core Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(themes).map(t => (
                    <button 
                      key={t}
                      onClick={() => setConfig({...config, theme: t})}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${config.theme === t ? 'border-blue-500 bg-blue-50' : 'border-slate-50'}`}
                    >
                      <span className="text-[10px] font-black uppercase">{t}</span>
                      <div className={`w-6 h-6 rounded-lg ${themes[t].side}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADMISSION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter mb-8 italic">Patient Admission</h3>
            <form onSubmit={handleAdmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Full Name</label>
                <input required value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-500/20" placeholder="e.g. Elena Gilbert" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Department</label>
                <input required value={newPatient.dept} onChange={e => setNewPatient({...newPatient, dept: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-500/20" placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Condition</label>
                <select value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-blue-500/20 appearance-none">
                  <option>Stable</option>
                  <option>Critical</option>
                  <option>Observation</option>
                </select>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="submit" className={`${style.accent} flex-1 text-white p-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl`}>Confirm Admission</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-500 px-8 rounded-[2rem] font-black text-[10px] uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;