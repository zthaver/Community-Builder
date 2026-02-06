"use client";

import React, { useState } from "react";
import { signup } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { Button } from "../../app/components/ui/button";

export default function LoginPage() {
  // 🔐 Supabase client + router
  const supabase = createClient();
  const router = useRouter();

  /* =======================
      LOGIN (CLIENT SIDE)
     ======================= */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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
      setLoginError("Invalid email or password");
      setLoginLoading(false);
      return;
    }

    // ✅ IMPORTANT: wait for session before redirect
    if (data.session) {
      router.replace("/home");
    }
  };

  /* =======================
      SIGNUP (SERVER ACTION)
     ======================= */
  const [signupState, signupAction, signupPending] =
    React.useActionState(signup, { error: null });

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("");

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 gap-16">
      {/* ================= LOGIN FORM ================= */}
      <div className="flex flex-col items-start">
        <h1 className="text-[60px] mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label>Email:</label>
          <input
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="p-2 border rounded"
            disabled={loginLoading}
          />

          <label>Password:</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="p-2 border rounded"
            disabled={loginLoading}
          />

          {loginError && (
            <p className="text-red-500 text-sm">{loginError}</p>
          )}

          <Button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded mt-2 flex items-center justify-center gap-2"
            disabled={loginLoading}
          >
            {loginLoading && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            Login
          </Button>
        </form>
      </div>

      {/* ================= SIGNUP FORM ================= */}
      <div className="flex flex-col items-start">
        <h1 className="text-[60px] mb-4">Sign Up</h1>

        <form action={signupAction} className="flex flex-col gap-4">
          <label>Name:</label>
          <input
            name="name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`p-2 border rounded ${
              signupState.fieldErrors?.name ? "border-red-500" : ""
            }`}
          />
          {signupState.fieldErrors?.name && (
            <p className="text-red-500 text-sm">
              {signupState.fieldErrors.name}
            </p>
          )}

          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className={`p-2 border rounded ${
              signupState.fieldErrors?.email ? "border-red-500" : ""
            }`}
          />
          {signupState.fieldErrors?.email && (
            <p className="text-red-500 text-sm">
              {signupState.fieldErrors.email}
            </p>
          )}

          <label>Password:</label>
          <input
            name="password"
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className={`p-2 border rounded ${
              signupState.fieldErrors?.password ? "border-red-500" : ""
            }`}
          />
          {signupState.fieldErrors?.password && (
            <p className="text-red-500 text-sm">
              {signupState.fieldErrors.password}
            </p>
          )}

          <label>Role:</label>
          <select
            name="role"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className={`p-2 border rounded ${
              signupState.fieldErrors?.role ? "border-red-500" : ""
            }`}
          >
            <option value="">Select role</option>
            <option value="senior">Senior</option>
            <option value="moderator">Moderator</option>
            <option value="familymember">Family Member</option>
          </select>
          {signupState.fieldErrors?.role && (
            <p className="text-red-500 text-sm">
              {signupState.fieldErrors.role}
            </p>
          )}

          {signupState.error && !signupState.fieldErrors && (
            <p className="text-red-500 text-sm">{signupState.error}</p>
          )}

          <Button
            type="submit"
            className="bg-green-500 text-white py-2 rounded mt-2 flex items-center justify-center gap-2"
            disabled={signupPending}
          >
            {signupPending && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
