import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (data.user) {
      setSuccessMessage(
        'Account created successfully. Please check your email to confirm your account.'
      )

      setFullName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <main className="min-h-screen bg-[#080d18] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
            Digital Heroes
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Join the platform, track your scores, support a charity and
            participate in monthly draws.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-300">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Signup