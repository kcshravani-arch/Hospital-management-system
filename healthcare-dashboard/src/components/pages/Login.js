import React, { useState } from 'react';

const Login = ({ onLogin, toRegister }) => {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  // Inside Login.js - Update your handleSignIn function:
const handleSignIn = () => {
  if (credentials.id === 'ADMIN' && credentials.password === '1234') {
    localStorage.setItem('hosp_auth', 'true'); // Save session
    onLogin();
  } else {
    setError('Access Denied: Incorrect License or Password');
  }
};

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex w-1/2 bg-[#003c90] items-center justify-center p-20 text-white">
        <div>
          <h1 className="text-6xl font-black mb-6">PulsePoint</h1>
          <p className="text-xl text-blue-200">Engineered for precision, designed for care.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-[#f7f9fb]">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-2">Staff Portal</h2>
          <p className="text-slate-500 mb-8">Enter credentials (ID: ADMIN, Pass: 1234)</p>
          
          {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}

          <div className="space-y-6">
            <input 
              type="text" 
              placeholder="License ID" 
              className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCredentials({...credentials, id: e.target.value})}
            />
            <input 
              type="password" 
              placeholder="Secure Password" 
              className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <button onClick={handleSignIn} className="w-full bg-[#0f52ba] text-white py-4 rounded-xl font-bold">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;