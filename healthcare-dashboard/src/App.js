import React, { useState, useEffect } from 'react';

const PulsePointApp = () => {
  // --- 1. AUTH & NAVIGATION STATE ---
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'patient_portal', 'dashboard_receptionist', 'dashboard_doctor'
  const [role, setRole] = useState(null); // 'receptionist', 'doctor'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfile, setShowProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientMode, setPatientMode] = useState('book'); // 'book', 'status'
  const [statusSearchId, setStatusSearchId] = useState('');
  const [statusResult, setStatusResult] = useState(null);

  const [user] = useState({
    name: 'Divyashree',
    email: 'Divya345@university.edu',
    role: 'Admin',
    major: 'Receptionist',
    schedule: [
      { time: "08:00 AM", task: "X-ray nurse" },
      { time: "10:30 AM", task: "Ward Rounds" },
      { time: "02:00 PM", task: "shift to 1stfloor" }
    ]
  });

  const CORRECT_PASSWORD = "admin123";

  // --- 2. SYSTEM CONFIG ---
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('pulse_config');
    return saved ? JSON.parse(saved) : {
      hospitalName: "PulsePoint Central",
      theme: "Midnight Blue",
    };
  });

  // --- 3. DATA STATE ---
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', dept: '', condition: 'Stable' });
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch data from MySQL Backend
  const fetchData = async () => {
    try {
      const [patientsRes, apptRes, doctorsRes] = await Promise.all([
        fetch('http://localhost:5000/api/patients'),
        fetch('http://localhost:5000/api/appointments'),
        fetch('http://localhost:5000/api/doctors')
      ]);

      if (patientsRes.ok) setPatients(await patientsRes.json());
      if (apptRes.ok) setAppointments(await apptRes.json());
      if (doctorsRes.ok) setDoctors(await doctorsRes.json());
    } catch (err) {
      console.error("Database connection failed.", err);
    }
  };

  useEffect(() => {
    // Always fetch data to allow patients to see doctors, etc.
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('pulse_config', JSON.stringify(config));
  }, [config]);

  // --- 4. THEME DEFINITIONS ---
  const themes = {
    "Midnight Blue": { side: "bg-[#002855]", accent: "bg-[#0056b3]", text: "text-blue-500", btn: "bg-[#0056b3]" },
    "Emerald": { side: "bg-[#064e3b]", accent: "bg-[#059669]", text: "text-emerald-500", btn: "bg-[#059669]" },
    "Dark Gold": { side: "bg-[#1a1a1a]", accent: "bg-[#c5a059]", text: "text-amber-600", btn: "bg-[#c5a059]" },
    "Slate": { side: "bg-[#1e293b]", accent: "bg-[#475569]", text: "text-slate-500", btn: "bg-[#475569]" }
  };
  const style = themes[config.theme] || themes["Midnight Blue"];

  // --- 5. HANDLERS ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === CORRECT_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError(false);
      setCurrentView(role === 'doctor' ? 'dashboard_doctor' : 'dashboard_receptionist');
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 500);
    }
  };

  const handleAdmission = async (e) => {
    e.preventDefault();
    const newId = Math.floor(1000 + Math.random() * 9000);
    const entry = { id: newId, name: newPatient.name, dept: newPatient.dept, condition: newPatient.condition };

    try {
      await fetch('http://localhost:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      fetchData();
      setNewPatient({ name: '', dept: '', condition: 'Stable' });
      setShowModal(false);
    } catch (err) {
      alert("Error adding patient to database.");
    }
  };

  const handleDischarge = async (id, name) => {
    if (window.confirm(`Are you sure you want to discharge ${name}?`)) {
      try {
        await fetch(`http://localhost:5000/api/patients/${id}`, { method: 'DELETE' });
        setPatients(patients.filter(p => p.id !== id));
      } catch (err) {
        alert("Error during discharge.");
      }
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  // --- VIEW: LANDING PAGE ---
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="z-10 max-w-5xl w-full">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-xl shadow-blue-500/30">✚</div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter mb-4">PulsePoint</h1>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-sm">Select your portal access</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Portal */}
            <button onClick={() => setCurrentView('patient_portal')} className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group border border-slate-100 text-left">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Patient Portal</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">Book appointments and manage your healthcare journey.</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Access Portal →</span>
            </button>

            {/* Receptionist Portal */}
            <button onClick={() => { setRole('receptionist'); setCurrentView('login'); }} className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group border border-slate-100 text-left">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">🏥</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Receptionist</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">Manage hospital admissions, records, and system settings.</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Staff Login →</span>
            </button>

            {/* Doctor Portal */}
            <button onClick={() => { setRole('doctor'); setCurrentView('login'); }} className="bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group border border-slate-100 text-left">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 group-hover:scale-110 transition-transform">⚕️</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Doctor Portal</h3>
              <p className="text-slate-500 text-sm font-bold mb-8">Review and manage your upcoming patient appointments.</p>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Physician Login →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: PATIENT BOOKING PORTAL ---
  if (currentView === 'patient_portal') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative">
        <button onClick={() => setCurrentView('landing')} className="absolute top-8 left-8 bg-white px-6 py-3 rounded-full shadow-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">← Back</button>
        <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex bg-slate-100 p-1 rounded-full mb-8">
            <button onClick={() => {setPatientMode('book'); setStatusResult(null);}} className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${patientMode === 'book' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Book</button>
            <button onClick={() => setPatientMode('status')} className={`flex-1 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${patientMode === 'status' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>Check Status</button>
          </div>

          {patientMode === 'book' ? (
            <>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-emerald-500/30">👤</div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Book Appointment</h2>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const newId = `APT-${Math.floor(100 + Math.random() * 900)}`;
                const time = e.target.time.value;
                const doctor = e.target.doctor.value;
                const patient = e.target.patient.value;
                const reason = e.target.reason.value;
                
                try {
                  await fetch('http://localhost:5000/api/appointments/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: newId, time, doctor, patient, reason })
                  });
                  alert(`Appointment booked successfully! Your Appointment ID is ${newId}. Keep this ID to check your status.`);
                  fetchData();
                  setPatientMode('status');
                  setStatusSearchId(newId);
                  const newAppt = { id: newId, time, doctor, patient, reason, status: 'Pending' };
                  setStatusResult(newAppt);
                } catch (err) {
                  alert("Failed to book appointment.");
                }
              }} className="space-y-4">
                <input name="patient" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-emerald-500" placeholder="Your Full Name" />
                <select name="doctor" required defaultValue="" className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-emerald-500 text-slate-700">
                  <option value="" disabled>Select a Doctor</option>
                  {doctors.map(d => <option key={d.ID} value={d.Name}>{d.Name} ({d.Specialization})</option>)}
                </select>
                <input name="time" type="time" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-emerald-500 text-slate-700" />
                <textarea name="reason" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-emerald-500 min-h-[100px] resize-none" placeholder="Reason for visit"></textarea>
                <button type="submit" className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-600 shadow-xl mt-6">Confirm Booking</button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Check Status</h2>
                <p className="text-slate-500 text-sm font-bold mt-2">Enter your Appointment ID</p>
              </div>
              <div className="flex gap-2 mb-8">
                <input value={statusSearchId} onChange={(e) => setStatusSearchId(e.target.value)} className="flex-1 p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-emerald-500 uppercase" placeholder="APT-123" />
                <button onClick={() => {
                  const found = appointments.find(a => a.id.toLowerCase() === statusSearchId.toLowerCase());
                  setStatusResult(found || 'not_found');
                }} className="bg-emerald-500 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600">Search</button>
              </div>
              
              {statusResult && statusResult !== 'not_found' && (
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusResult.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {statusResult.status || 'Pending'}
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{statusResult.patient}</h4>
                  <p className="text-sm font-bold text-slate-500 mb-4">With <span className="text-emerald-600">{statusResult.doctor}</span></p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time: <span className="text-slate-800">{statusResult.time}</span></p>
                </div>
              )}
              {statusResult === 'not_found' && (
                <div className="text-center p-6 bg-red-50 rounded-3xl border border-red-100">
                  <p className="text-red-500 font-bold text-sm">Appointment not found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW: LOGIN PAGE ---
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 relative">
        <button onClick={() => setCurrentView('landing')} className="absolute top-8 left-8 bg-white px-6 py-3 rounded-full shadow-md text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">← Back</button>
        <div className={`bg-white w-full max-w-md rounded-[3rem] p-12 shadow-2xl border ${loginError ? 'animate-bounce border-red-500' : 'border-slate-200'}`}>
          <div className="text-center mb-10">
            <div className={`w-16 h-16 ${role === 'doctor' ? 'bg-amber-500' : 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4`}>
              {role === 'doctor' ? '⚕️' : '🏥'}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter capitalize">{role} Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">System User</label>
              <p className="font-bold text-slate-700">{role === 'doctor' ? 'Dr. Smith' : user.name}</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-2 ring-blue-500/20">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Security Password</label>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="••••••••" className="w-full bg-transparent font-bold outline-none border-none" required />
            </div>
            <button type="submit" className={`w-full py-5 ${role === 'doctor' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-slate-900 hover:bg-blue-600 shadow-slate-900/30'} text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl mt-4`}>
              INITIALIZE SYSTEM
            </button>
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">Hint: {CORRECT_PASSWORD}</div>
          </form>
        </div>
      </div>
    );
  }

  // --- VIEW: DOCTOR PORTAL ---
  if (currentView === 'dashboard_doctor') {
    return (
      <div className="min-h-screen bg-slate-50 p-12">
        <header className="mb-12 flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4 block">{config.hospitalName}</span>
            <h2 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">Doctor Portal</h2>
            <p className="text-slate-500 font-bold mt-4">Manage your upcoming appointments</p>
          </div>
          <button onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setPasswordInput(''); }} className="bg-white px-8 py-4 rounded-[2rem] shadow-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:-translate-y-1 transition-all">Lock Terminal</button>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map(appt => (
            <div key={appt.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-all hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-400 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-amber-100 text-amber-700 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">{appt.time}</div>
                <span className="text-[10px] text-slate-300 font-mono font-bold">{appt.id}</span>
              </div>
              <h4 className="text-xl font-black text-slate-800 mb-1">{appt.patient}</h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 mb-6 mt-4">
                <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason for visit</span>
                <p className="text-xs font-bold text-slate-700">{appt.reason}</p>
              </div>
              <div className="flex gap-3">
                {(!appt.status || appt.status === 'Pending') ? (
                  <>
                    <button onClick={() => handleUpdateStatus(appt.id, 'Accepted')} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">Accept</button>
                    <button onClick={() => handleUpdateStatus(appt.id, 'Denied')} className="flex-1 bg-slate-100 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors">Deny</button>
                  </>
                ) : (
                  <div className={`w-full py-4 text-center rounded-2xl text-[10px] font-black uppercase tracking-widest border ${appt.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {appt.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW: RECEPTIONIST DASHBOARD ---
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className={`w-72 ${style.side} text-white flex flex-col p-8 fixed h-full z-40 transition-all`}>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-black">✚</div>
          <h1 className="text-2xl font-black tracking-tighter italic">PulsePoint</h1>
        </div>

        <button onClick={() => setShowProfile(!showProfile)} className="mb-10 flex items-center gap-4 p-4 rounded-[2rem] bg-white/10 hover:bg-white/20 transition-all ring-1 ring-white/10">
          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-blue-900 font-black">{user.name[0]}</div>
          <div className="text-left overflow-hidden">
            <p className="text-sm font-black truncate">{user.name}</p>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">{user.role}</p>
          </div>
        </button>

        <nav className="space-y-1 flex-1">
          {['overview', 'appointments', 'doctors', 'settings'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowProfile(false); }} className={`w-full text-left p-5 rounded-2xl capitalize font-black text-sm transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-blue-100/60 hover:text-white hover:bg-white/10'}`}>
              {tab}
            </button>
          ))}
        </nav>

        {showProfile && (
          <div className="absolute top-32 left-72 ml-4 w-96 bg-white rounded-[3rem] shadow-2xl border border-slate-100 z-50 p-10 text-slate-800 animate-in fade-in zoom-in-95">
            <div className="text-center border-b pb-8 mb-8">
              <div className={`${style.accent} w-24 h-24 rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-4`}>{user.name[0]}</div>
              <h4 className="text-2xl font-black">{user.name}</h4>
              <p className="text-[11px] text-blue-500 font-black uppercase tracking-widest mb-1">{user.major}</p>
              <p className="text-[11px] text-slate-400 font-bold">{user.email}</p>
            </div>
            <div className="space-y-3 mb-10">
              {user.schedule.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-blue-600">{item.time}</span>
                  <span className="text-xs font-bold text-slate-700">{item.task}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setIsLoggedIn(false); setCurrentView('landing'); setPasswordInput(''); }} className="w-full py-5 bg-red-50 text-red-500 font-black text-xs rounded-2xl hover:bg-red-500 transition-all uppercase tracking-widest">LOCK TERMINAL</button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-72 flex-1 p-16">
        <header className="mb-16 flex justify-between items-end">
          <div>
            <span className={`text-[10px] font-black ${style.text} uppercase tracking-[0.4em] mb-4 block`}>{config.hospitalName}</span>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter leading-none uppercase">{activeTab}</h2>
          </div>
          {activeTab === 'overview' && (
            <button onClick={() => setShowModal(true)} className={`${style.btn} text-white px-10 py-6 rounded-[2rem] font-black shadow-2xl hover:-translate-y-1 transition-all uppercase text-[10px] tracking-widest`}>
              + Admit Patient
            </button>
          )}
        </header>

        <div className="animate-in fade-in duration-500">
          {activeTab === 'overview' && (
            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-[3rem] shadow-xl border border-blue-100/50 overflow-hidden backdrop-blur-xl">
              <table className="w-full text-left">
                <thead className="bg-blue-600 text-[10px] font-black text-blue-100 uppercase tracking-widest">
                  <tr><th className="px-10 py-6">Patient</th><th className="px-10 py-6">Dept</th><th className="px-10 py-6">Condition</th><th className="px-10 py-6 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-blue-50">
                  {patients.map((p, i) => (
                    <tr key={p.id} className="hover:bg-white/80 transition-all cursor-pointer group">
                      <td className="px-10 py-6 font-black text-slate-800">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs ${i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'} shadow-md group-hover:scale-110 transition-transform`}>{p.name[0]}</div>
                          <div>
                            {p.name}
                            <span className="block text-[10px] text-blue-400 font-mono mt-1">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-slate-600 font-bold">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs">{p.dept}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-sm ${p.condition_status === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          <div className={`w-2 h-2 rounded-full ${p.condition_status === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                          {(p.condition_status || 'STABLE').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button onClick={() => handleDischarge(p.id, p.name)} className="bg-white border border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm">DISCHARGE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.filter(appt => appt.status === 'Accepted').length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-xl font-black text-slate-800">No Accepted Appointments</h3>
                  <p className="text-slate-500 font-bold mt-2">There are currently no appointments accepted by doctors.</p>
                </div>
              ) : (
                appointments.filter(appt => appt.status === 'Accepted').map(appt => (
                  <div key={appt.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all hover:-translate-y-1">
                    <div className={`absolute top-0 left-0 w-full h-2 ${style.accent} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${style.btn} text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest`}>{appt.time}</div>
                    <span className="text-[10px] text-slate-300 font-mono font-bold group-hover:text-slate-400 transition-colors">{appt.id}</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-1">{appt.patient}</h4>
                  <p className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400">With</span>
                    <span className={`${style.text}`}>{appt.doctor}</span>
                  </p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Purpose of Visit</span>
                    <p className="text-xs font-bold text-slate-700">{appt.reason}</p>
                  </div>
                </div>
              )))}
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map(doc => (
                <div key={doc.ID} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className={`${style.btn} w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-white font-black`}>{doc.Name[0]}</div>
                  <h4 className="text-lg font-black text-slate-800">{doc.Name}</h4>
                  <p className={`${style.text} font-bold text-[10px] uppercase mb-4`}>{doc.Specialization}</p>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact: {doc.PhoneNumber}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 max-w-2xl space-y-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-4">Terminal Identification</label>
                <input value={config.hospitalName} onChange={(e) => setConfig({ ...config, hospitalName: e.target.value })} className="w-full p-6 bg-slate-50 rounded-2xl font-bold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-4">Interface Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(themes).map(t => (
                    <button key={t} onClick={() => setConfig({ ...config, theme: t })} className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${config.theme === t ? 'border-blue-500 bg-blue-50' : 'border-slate-100'}`}>
                      <span className="text-[10px] font-black uppercase">{t}</span>
                      <div className={`w-6 h-6 rounded-lg ${themes[t].side}`}></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl">
            <h3 className="text-3xl font-black text-slate-800 mb-8 italic">New Admission</h3>
            <form onSubmit={handleAdmission} className="space-y-6">
              <input required value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="Patient Name" />
              <input required value={newPatient.dept} onChange={e => setNewPatient({ ...newPatient, dept: e.target.value })} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none" placeholder="Department" />
              <select value={newPatient.condition} onChange={e => setNewPatient({ ...newPatient, condition: e.target.value })} className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none">
                <option>Stable</option><option>Critical</option><option>Observation</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button type="submit" className={`${style.btn} flex-1 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase`}>Finalize</button>
                <button type="button" onClick={() => setShowModal(false)} className="bg-slate-100 text-slate-500 px-8 rounded-[2rem] font-black text-[10px] uppercase">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PulsePointApp;