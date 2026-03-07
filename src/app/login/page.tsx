'use client';

import React, { useState } from 'react';
import { signup } from './actions';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { Button } from '../../app/components/ui/button';
import { MailIcon, LockIcon, UserIcon, UsersIcon } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  /* =======================
      LOGIN (CLIENT SIDE)
     ======================= */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setLoginError('Invalid email or password. Please try again.');
      setLoginLoading(false);
      return;
    }

    if (data.session) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        setLoginError(
          'Login successful but session sync failed. Please refresh the page.',
        );
        setLoginLoading(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 100));
      window.location.href = '/home';
    }
  };

  /* =======================
      SIGNUP (SERVER ACTION)
     ======================= */
  const [signupState, signupAction, signupPending] = React.useActionState(
    signup,
    { error: null },
  );

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Community Builder</h1>
          <p className="text-xl text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* ================= LOGIN FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[420px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">Already have an account? Sign in below.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <MailIcon className="inline w-5 h-5 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="your.email@example.com"
                  disabled={loginLoading}
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <LockIcon className="inline w-5 h-5 mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your password"
                  disabled={loginLoading}
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-lg">
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 rounded-xl mt-2 flex items-center justify-center gap-3 min-h-[60px]"
                disabled={loginLoading}
              >
                {loginLoading && (
                  <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></span>
                )}
                Sign In
              </Button>
            </form>
          </div>

          {/* ================= SIGNUP FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[420px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">New here? Sign up to join our community.</p>

            <form action={signupAction} className="flex flex-col gap-5">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <UserIcon className="inline w-5 h-5 mr-2" />
                  Your Name
                </label>
                <input
                  name="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {signupState.fieldErrors?.name && (
                  <p className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <MailIcon className="inline w-5 h-5 mr-2" />
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                />
                {signupState.fieldErrors?.email && (
                  <p className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <LockIcon className="inline w-5 h-5 mr-2" />
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {signupState.fieldErrors?.password && (
                  <p className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  <UsersIcon className="inline w-5 h-5 mr-2" />
                  I am a...
                </label>
                <select
                  name="role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Please select your role</option>
                  <option value="senior">Senior</option>
                  <option value="moderator">Moderator</option>
                  <option value="familymember">Family Member</option>
                </select>
                {signupState.fieldErrors?.role && (
                  <p className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.role}
                  </p>
                )}
              </div>

              {signupState.error && !signupState.fieldErrors && (
                <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-lg">
                  {signupState.error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-xl mt-2 flex items-center justify-center gap-3 min-h-[60px]"
                disabled={signupPending}
              >
                {signupPending && (
                  <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></span>
                )}
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
