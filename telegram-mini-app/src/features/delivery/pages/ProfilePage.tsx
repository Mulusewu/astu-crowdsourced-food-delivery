import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../customer/components/BottomNavBar";
import { validateEmail, validatePhone, validatePassword } from "../../customer/lib/validators";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: ""
  });

  return (
    <div className="bg-gray-100 min-h-screen pb-20 flex justify-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen relative shadow-sm font-sans flex flex-col">
        
        {/* Header */}
        <div className="px-4 pt-6 pb-2 flex items-center relative">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Profile
          </h1>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-lg border-[3px] border-white ring-2 ring-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80" 
                alt="Helen" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 hover:scale-105 transition-transform">
               <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <h2 className="mt-4 text-[22px] font-extrabold text-gray-900">Helen</h2>
        </div>

        {/* Credentials Card */}
        <div className="mx-4 mt-8 bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-3xl pt-2 pb-0 flex flex-col mb-10 overflow-hidden">
          
          {/* Email */}
          <div className="flex flex-col border-b border-orange-100/50 group">
            <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 w-full">
                <svg className={`w-6 h-6 shrink-0 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-600 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <input 
                  type="email" 
                  placeholder="first.last@astu.edu.et" 
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    if (errors.email) setErrors(prev => ({ ...prev, email: validateEmail(val) }));
                  }}
                  onBlur={(e) => setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }))}
                  className="text-gray-900 font-medium text-sm outline-none bg-transparent w-full placeholder-gray-400" 
                />
              </div>
              <svg className="w-4 h-4 shrink-0 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            {errors.email && <div className="px-[52px] pb-3 text-red-500 text-xs font-semibold">{errors.email}</div>}
          </div>

          {/* Phone */}
          <div className="flex flex-col border-b border-orange-100/50 group">
            <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 w-full">
                <svg className={`w-6 h-6 shrink-0 transition-colors ${errors.phone ? 'text-red-500' : 'text-gray-600 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <input 
                  type="tel" 
                  placeholder="09xxxxxxxx or 07xxxxxxxx" 
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhone(val);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: validatePhone(val) }));
                  }}
                  onBlur={(e) => setErrors(prev => ({ ...prev, phone: validatePhone(e.target.value) }))}
                  className="text-gray-900 font-medium text-sm outline-none bg-transparent w-full placeholder-gray-400" 
                />
              </div>
              <svg className="w-4 h-4 shrink-0 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            {errors.phone && <div className="px-[52px] pb-3 text-red-500 text-xs font-semibold">{errors.phone}</div>}
          </div>

          {/* Password */}
          <div className="flex flex-col border-b border-orange-100/50 group">
            <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4 w-full">
                <svg className={`w-6 h-6 shrink-0 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-600 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);
                    if (errors.password) setErrors(prev => ({ ...prev, password: validatePassword(val) }));
                  }}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={(e) => {
                    setIsPasswordFocused(false);
                    setErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }));
                  }}
                  className="text-gray-900 font-medium text-sm outline-none bg-transparent w-full placeholder-gray-400" 
                />
              </div>
              <svg className="w-4 h-4 shrink-0 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            {errors.password && <div className="px-[52px] pb-3 text-red-500 text-xs font-semibold">{errors.password}</div>}
            {isPasswordFocused && !errors.password && <p className="text-[11px] text-gray-400 px-[52px] pb-2">Use at least 8 characters with letters and numbers</p>}
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition-colors group relative rounded-b-3xl">
            <div className="flex items-center gap-4 w-full relative z-10">
              <svg className="w-6 h-6 shrink-0 text-gray-600 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <select defaultValue="" className="text-gray-900 font-medium text-sm outline-none bg-transparent w-full appearance-none cursor-pointer">
                <option value="" disabled hidden>Payment Method</option>
                <option value="telebirr">Telebirr</option>
                <option value="cbe">CBE</option>
              </select>
            </div>
            <svg className="w-4 h-4 shrink-0 text-gray-400 absolute right-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>

        </div>

        <BottomNavBar activeTab="profile" bgColor="bg-white" />
      </div>
    </div>
  );
};

export default ProfilePage;