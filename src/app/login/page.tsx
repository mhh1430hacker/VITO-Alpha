'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locked, setLocked] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setLocked(false)

    try {
      const response = await authAPI.login(email, password)
      const { access_token, refresh_token, user } = response.data

      localStorage.setItem('access_token', access_token)
      if (refresh_token) localStorage.setItem('refresh_token', refresh_token)

      setAuth(user, access_token, refresh_token)
      router.push('/dashboard')
    } catch (err: any) {
      const status = err.response?.status
      const detail = err.response?.data?.detail || 'Login failed'

      if (status === 423) {
        setLocked(true)
        setError(detail)
      } else if (status === 401) {
        setError(detail)
      } else {
        setError(detail)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djJIMjR2LTJoMTJ6TTM2IDI0djJIMjR2LTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/20 via-indigo-500/10 to-transparent rounded-full blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.1 }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">VITO</h1>
          <p className="text-white/30 mt-1 text-sm">Olfactory Intelligence Pro</p>
        </motion.div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl shadow-black/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
            <p className="text-white/30 text-sm mb-6">Enter your credentials to continue</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/60 text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/[0.03] border-white/5 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/60 text-xs">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-white/[0.03] border-white/5 text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-blue-500/20 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatedError error={error} locked={locked} />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.div>

            <p className="text-center">
              <a href="/forgot-password" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Forgot password?
              </a>
            </p>
            <p className="text-center mt-2">
              <a href="/signup" className="text-xs text-violet-400/40 hover:text-violet-400 transition-colors">
                Create an account
              </a>
            </p>
          </motion.form>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/15 text-xs mt-6"
        >
          VITO Olfactory Intelligence Pro · Alpha
        </motion.p>
      </motion.div>
    </div>
  )
}

function AnimatedError({ error, locked }: { error: string; locked: boolean }) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={false}
        animate={error ? { height: 'auto', opacity: 1, marginTop: 0 } : { height: 0, opacity: 0, marginTop: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {error && (
          <div className={`text-xs px-3 py-2 rounded-lg border ${
            locked
              ? 'border-orange-500/20 bg-orange-500/5 text-orange-300'
              : 'border-red-500/20 bg-red-500/5 text-red-300'
          }`}>
            {error}
          </div>
        )}
      </motion.div>
    </div>
  )
}
