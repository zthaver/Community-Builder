'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signup } from './actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import posthog from 'posthog-js';
import { Button } from '../../app/components/ui/button';
import { MailIcon, LockIcon, UserIcon, UsersIcon, PlayCircleIcon, AlertCircleIcon, Loader2Icon, CheckCircleIcon } from 'lucide-react';

const DEMO_EMAIL = 'demo@communitybuilder.com';
const DEMO_PASSWORD = 'demo123456';

function LoginPageContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================
      LOGIN (CLIENT SIDE)
     ======================= */
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/home';
  
  // Read messages synchronously from search params to avoid flicker
  const message = searchParams.get('message');
  const authMessage = message === 'login_required' 
    ? (searchParams.get('redirect')?.includes('blog') 
        ? 'Please sign in to read articles.'
        : searchParams.get('redirect')?.includes('calendar')
          ? 'Please sign in to view events.'
          : 'Please sign in to access this page.')
    : null;
  const loggedOutMessage = message === 'logged_out' 
    ? 'You have been successfully logged out.' 
    : null;

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
      setIsRedirecting(true);
      await new Promise((r) => setTimeout(r, 100));
      window.location.href = redirectPath;
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setLoginError(null);

    

    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (error) {
      setLoginError('Demo login is temporarily unavailable. Please try again later or create an account.');
      setGuestLoading(false);
      return;
    }

    if (data.session) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        setLoginError(
          'Login successful but session sync failed. Please refresh the page.',
        );
        setGuestLoading(false);
        posthog.capture('purchase_completed', { amount: 99 })
        return;
      }
      setIsRedirecting(true);
      await new Promise((r) => setTimeout(r, 100));
      window.location.href = redirectPath;
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

  // Track if any auth action is in progress
  const isAnyLoading = loginLoading || guestLoading || signupPending || isRedirecting;

  // Show redirecting screen to prevent flicker
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Signing you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Login Required Message */}
        {authMessage && (
          <div className="max-w-2xl mx-auto mb-6" role="alert" aria-live="assertive">
            <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 flex items-center gap-4">
              <AlertCircleIcon className="w-8 h-8 text-red-500 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-bold text-red-700">Sign In Required</h3>
                <p className="text-lg text-red-600">{authMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logged Out Message */}
        {loggedOutMessage && (
          <div className="max-w-2xl mx-auto mb-6" role="alert" aria-live="polite">
            <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 flex items-center gap-4">
              <CheckCircleIcon className="w-8 h-8 text-red-500 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-bold text-red-700">Logged Out</h3>
                <p className="text-lg text-red-600">{loggedOutMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Community Builder</h1>
          <p className="text-xl text-gray-600">Sign in to your account or create a new one</p>
        </div>

        {/* Guest/Demo Login Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-purple-800 mb-2">Want to Try First?</h3>
              <p className="text-lg text-gray-700 mb-5">
                No account needed! Click below to explore the community as a guest.
              </p>
              <button
                onClick={handleGuestLogin}
                disabled={isAnyLoading}
                aria-busy={guestLoading}
                aria-label="Try demo account - no account needed"
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold py-4 px-10 rounded-xl flex items-center justify-center gap-3 min-h-[60px] mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {guestLoading ? (
                  <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
                ) : (
                  <PlayCircleIcon size={28} aria-hidden="true" />
                )}
                {guestLoading ? 'Logging in...' : 'Try Demo Account'}
              </button>
              <p className="text-base text-gray-600 mt-3">
                You can create your own account anytime later.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-2xl mx-auto mb-8">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-lg text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* ================= LOGIN FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[420px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">Already have an account? Sign in below.</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5" aria-label="Sign in form">
              <div>
                <label htmlFor="login-email" className="block text-lg font-semibold text-gray-700 mb-2">
                  <MailIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="your.email@example.com"
                  disabled={isAnyLoading}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={loginError ? "login-error" : undefined}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-lg font-semibold text-gray-700 mb-2">
                  <LockIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your password"
                  disabled={isAnyLoading}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-describedby={loginError ? "login-error" : undefined}
                />
              </div>

              {loginError && (
                <div 
                  id="login-error"
                  role="alert" 
                  aria-live="polite"
                  className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-lg"
                >
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl py-4 rounded-xl mt-2 flex items-center justify-center gap-3 min-h-[60px]"
                disabled={isAnyLoading}
                aria-busy={loginLoading}
              >
                {loginLoading && (
                  <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
                )}
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </div>

          {/* ================= SIGNUP FORM ================= */}
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full lg:w-[420px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
            <p className="text-lg text-gray-600 mb-6 text-center">New here? Sign up to join our community.</p>

            <form action={signupAction} className="flex flex-col gap-5" aria-label="Create account form">
              <div>
                <label htmlFor="signup-name" className="block text-lg font-semibold text-gray-700 mb-2">
                  <UserIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  Your Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={signupState.fieldErrors?.name ? "true" : "false"}
                  aria-describedby={signupState.fieldErrors?.name ? "name-error" : undefined}
                />
                {signupState.fieldErrors?.name && (
                  <p id="name-error" role="alert" className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-lg font-semibold text-gray-700 mb-2">
                  <MailIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={signupState.fieldErrors?.email ? "true" : "false"}
                  aria-describedby={signupState.fieldErrors?.email ? "email-error" : undefined}
                />
                {signupState.fieldErrors?.email && (
                  <p id="email-error" role="alert" className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-lg font-semibold text-gray-700 mb-2">
                  <LockIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-required="true"
                  aria-invalid={signupState.fieldErrors?.password ? "true" : "false"}
                  aria-describedby={signupState.fieldErrors?.password ? "password-error" : undefined}
                />
                {signupState.fieldErrors?.password && (
                  <p id="password-error" role="alert" className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-role" className="block text-lg font-semibold text-gray-700 mb-2">
                  <UsersIcon className="inline w-5 h-5 mr-2" aria-hidden="true" />
                  I am a...
                </label>
                <select
                  id="signup-role"
                  name="role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className={`w-full p-4 text-lg border-2 rounded-xl focus:ring-2 focus:ring-blue-200 ${
                    signupState.fieldErrors?.role ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-invalid={signupState.fieldErrors?.role ? "true" : "false"}
                  aria-describedby={signupState.fieldErrors?.role ? "role-error" : undefined}
                >
                  <option value="">Please select your role</option>
                  <option value="senior">Senior</option>
                  <option value="moderator">Moderator</option>
                  <option value="familymember">Family Member</option>
                </select>
                {signupState.fieldErrors?.role && (
                  <p id="role-error" role="alert" className="text-red-600 text-base mt-1 font-medium">
                    {signupState.fieldErrors.role}
                  </p>
                )}
              </div>

              {signupState.error && !signupState.fieldErrors && (
                <div role="alert" aria-live="polite" className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-lg">
                  {signupState.error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-xl mt-2 flex items-center justify-center gap-3 min-h-[60px]"
                disabled={isAnyLoading}
                aria-busy={signupPending}
              >
                {signupPending && (
                  <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
                )}
                {signupPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <Loader2Icon className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
