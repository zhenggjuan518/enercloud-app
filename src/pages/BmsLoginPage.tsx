import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function BmsLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    if (username && password) {
      navigate('/overview')
    } else {
      setErrorMsg('Please enter both username and password')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center" style={{ fontFamily: '"Geist", sans-serif', backgroundColor: '#f6f7f8', color: '#1e293b' }}>
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'radial-gradient(#0fa5e6 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 z-0 pointer-events-none" style={{ backgroundColor: '#0fa5e6' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full blur-[80px] opacity-10 z-0 pointer-events-none" style={{ backgroundColor: '#0fa5e6' }} />

      <div className="relative z-10 w-full max-w-[480px] px-6 py-12">
        {/* Logo Area */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-inner" style={{ backgroundColor: 'rgba(15, 165, 230, 0.1)' }}>
            <span className="material-symbols-outlined text-5xl" style={{ color: '#0fa5e6' }}>battery_charging_full</span>
          </div>
          <h1 className="tracking-tight text-[32px] font-bold leading-tight text-center" style={{ color: '#0f172a' }}>
            BMS Platform
          </h1>
          <p className="text-sm mt-2 text-center" style={{ color: '#64748b' }}>
            Energy Storage Power Station Data Monitoring
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold" style={{ color: '#334155' }}>Username</p>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-[#0fa5e6] transition-colors">person</span>
              <input
                type="text"
                name="username"
                defaultValue="admin"
                placeholder="Enter your username"
                className="w-full h-14 pl-12 pr-4 rounded-xl text-base bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-[#0fa5e6] focus:outline-none focus:ring-2 focus:ring-[#0fa5e6]/20 transition-all shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold" style={{ color: '#334155' }}>Password</p>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-[#0fa5e6] transition-colors">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                defaultValue="admin"
                placeholder="Enter your password"
                className="w-full h-14 pl-12 pr-12 rounded-xl text-base bg-white/80 backdrop-blur-sm border border-slate-200 focus:border-[#0fa5e6] focus:outline-none focus:ring-2 focus:ring-[#0fa5e6]/20 transition-all shadow-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="text-red-500 text-sm mt-[-4px]">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-between items-center py-2">
            <label className="flex gap-x-3 py-2 cursor-pointer items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white checked:border-[#0fa5e6] checked:bg-[#0fa5e6] focus:outline-none focus:ring-2 focus:ring-[#0fa5e6]/20 transition-all"
                />
                {rememberMe && (
                  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white material-symbols-outlined text-[16px] font-bold">check</span>
                )}
              </div>
              <span className="text-sm font-medium select-none" style={{ color: '#475569' }}>Remember Me</span>
            </label>
            <a href="#" className="text-sm font-semibold hover:underline" style={{ color: '#0fa5e6' }}>Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center h-14 px-5 rounded-xl text-base font-bold tracking-wide text-white transition-all active:scale-[0.98]"
            style={{
              backgroundColor: '#0fa5e6',
              boxShadow: '0 4px 14px 0 rgba(15,165,230,0.39)',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(15,165,230,0.23)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = '0 4px 14px 0 rgba(15,165,230,0.39)'
            }}
          >
            <span className="truncate">Secure Login</span>
            <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: '#64748b' }}>
            By logging in, you agree to the{' '}
            <a href="#" className="hover:underline" style={{ color: '#0fa5e6' }}>Terms of Service</a>
            {' & '}
            <a href="#" className="hover:underline" style={{ color: '#0fa5e6' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
