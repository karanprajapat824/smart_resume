"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { URL } from "@/app/page";
import Loader from "@/components/Loader";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "login" | "signup"
  ) {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  }

  async function handleLogin() {
    if (!loginData.email.includes("@")) {
      setError("Invalid Email Address");
      return;
    }
    if (loginData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/my-resumes";
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    if (!signupData.email.includes("@")) {
      setError("Invalid Email Address");
      return;
    }
    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(URL + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/my-resumes";
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-auto flex flex-col justify-around">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <FileText className="h-8 w-8" />
            Smart Resume
          </div>
        </div>

        {/* Auth Container */}
        <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-xl p-8">
          {isLogin ? (
            <div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-center">Welcome back</div>
                <div className="text-muted-foreground text-center pb-6">
                  Sign in to your Smart Resume account
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    className="rounded px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={loginData.email}
                    onChange={(e) => handleChange(e, "login")}
                    name="email"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold" htmlFor="login-password">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="rounded px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={loginData.password}
                    onChange={(e) => handleChange(e, "login")}
                    name="password"
                  />
                </div>

                <div className="text-right">
                  <button className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>

                <div className="flex flex-col gap-y-2">
                  {error && <div className="text-destructive">{error}</div>}
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="rounded-lg shadow-sm cursor-pointer bg-primary text-primary-foreground text-center px-8 py-2 flex justify-center items-center disabled:opacity-70"
                  >
                    {loading ? <Loader /> : "Sign In"}
                  </button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Sign up here
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-center">
                  Welcome to Smart Resume
                </div>
                <div className="text-muted-foreground text-center pb-6">
                  Create your account to get started
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="rounded px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={signupData.email}
                    onChange={(e) => handleChange(e, "signup")}
                    name="email"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold" htmlFor="signup-password">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    className="rounded px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={signupData.password}
                    onChange={(e) => handleChange(e, "signup")}
                    name="password"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="rounded px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-primary"
                    value={signupData.confirmPassword}
                    onChange={(e) => handleChange(e, "signup")}
                    name="confirmPassword"
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  {error && <div className="text-destructive">{error}</div>}
                  <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="rounded-lg shadow-sm cursor-pointer bg-primary text-primary-foreground text-center px-8 py-2 flex justify-center items-center disabled:opacity-70"
                  >
                    {loading ? <Loader /> : "Create Account"}
                  </button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Sign in here
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
