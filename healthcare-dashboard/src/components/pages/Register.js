import React from 'react';

const Register = ({ toLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] font-sans p-6">
      <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-2 text-slate-800" style={{ fontFamily: 'Manrope' }}>Staff Registration</h2>
        <p className="text-slate-500 mb-8">Request administrative access to the PulsePoint network.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="First Name" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Last Name" className="p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="Work Email" className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Employee ID" className="col-span-2 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button className="w-full bg-[#0f52ba] text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 mb-6">
          Submit Request
        </button>

        <p className="text-center text-sm text-slate-500 font-medium">
          Already registered? <button onClick={toLogin} className="text-[#0f52ba] font-bold hover:underline">Return to Login</button>
        </p>
      </div>
    </div>
  );
};

export default Register;