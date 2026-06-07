import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
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
    <div className="bg-surface text-on-surface min-h-screen relative overflow-hidden flex items-center justify-center p-container-margin">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/10 rounded-full blur-[120px]" />
        {/* Subtle circuit lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-on-surface" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 0 L 100 200 L 300 400 L 300 1000" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M 0 500 L 150 500 L 250 600 L 800 600" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="300" cy="400" fill="currentColor" r="4" />
          <circle cx="150" cy="500" fill="currentColor" r="4" />
        </svg>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-[400px] z-10 relative">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center justify-center mb-stack-lg">
          <div className="flex items-center gap-3 mb-stack-sm text-primary">
            <span className="material-symbols-outlined text-[40px] icon-fill">battery_charging_full</span>
            <div className="flex flex-col leading-tight">
              <span className="text-headline-lg-mobile tracking-tight">BMS</span>
              <span className="text-label-md text-on-surface-variant font-medium">Energy Storage</span>
            </div>
          </div>
          <h1 className="text-headline-lg-mobile text-center px-4">
            BMS Power Station<br />Monitoring
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-surface-variant p-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-stack-md">
            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue="admin"
                placeholder="Username"
                required
                className="block w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm text-body-lg"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue="admin"
                placeholder="Password"
                required
                className="block w-full pl-11 pr-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200 shadow-sm text-body-lg"
              />
            </div>

            {errorMsg && (
              <div className="text-error text-sm mt-[-8px]">
                {errorMsg}
              </div>
            )}

            {/* Options Row */}
            <div className="flex items-center justify-between pt-stack-sm pb-stack-md">
              {/* Custom Toggle */}
              <label className="flex items-center cursor-pointer" htmlFor="remember_me">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="remember_me"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors duration-200 ${rememberMe ? 'bg-primary' : 'bg-surface-variant'}`} />
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${rememberMe ? 'translate-x-full' : 'translate-x-0'}`} />
                </div>
                <span className="ml-3 text-body-sm text-on-surface-variant">Remember Me</span>
              </label>
              <a href="#" className="text-body-sm text-primary hover:text-primary-container transition-colors duration-200">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-primary text-on-primary rounded-lg font-semibold text-base shadow-[0_4px_14px_0_rgba(0,107,92,0.39)] hover:shadow-[0_6px_20px_rgba(0,107,92,0.23)] hover:bg-primary-container transition-all duration-200 active:scale-[0.98]"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <a href="#" className="text-primary font-semibold hover:underline transition-all">Sign Up</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
