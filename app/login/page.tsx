"use client";
import { useRef, useState } from "react";
import { X, FileText } from "lucide-react";
import { URL } from "@/exports/info";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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

  const loginRefs = useRef<Array<HTMLInputElement | HTMLButtonElement | HTMLAnchorElement | null>>([]);

  function handleLoginRefs(index: number) {
    const nextInput = loginRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    } else {
    }
  }

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
    console.log(loginData, signupData);
  }

  async function handleLogin() {
    if (!loginData.email.includes("@")) {
      setError("Invalid Email Address");
      return;
    }
    if (loginData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        const redirectTo = localStorage.getItem("redirectAfterLogin");
        window.location.href = redirectTo || "/my-resumes";
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
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(URL + "/auth/signup", {
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
        const redirectTo = localStorage.getItem("redirectAfterLogin");
        window.location.href = redirectTo || "/templates";
      } else {
        setError(data.message || "Signup failed. Please try again later.");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border h-screen flex items-center justify-center">
      <div className="grid grid-cols-[1fr_2fr] rounded overflow-hidden items-center border h-[90%] w-[90%] shadow-lg">
        <div className="bg-white hideScrollBar h-full">
          {isLogin ? (
            <div className="px-10 py-10">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-center">Welcome back</div>
                <div className="text-muted-foreground text-center pb-6">
                  Sign in to your Smart Resume account
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Input
                    ref={(el) => { if (el) loginRefs.current[0] = el }}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => handleChange(e, "login")}
                    name="email"
                    classNameForLabel="text-xl"
                    label="Email"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleLoginRefs(0)
                    }
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <Input
                      ref={(el) => { if (el) loginRefs.current[1] = el }}
                      label="Password"
                      id="login-password"
                      type="text"
                      placeholder="Enter your password"
                      isPassword={true}
                      classNameForLabel="text-xl"
                      value={loginData.password}
                      onChange={(e) => handleChange(e, "login")}
                      name="password"
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLoginRefs(1)
                      }
                    />
                  </div>

                </div>

                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="flex flex-col gap-y-4">
                  {error &&
                    <div className="flex gap-2 items-center text-destructive-foreground border px-4 py-2 rounded bg-destructive">
                      <X className="h-4 w-4 cursor-pointer" onClick={() => setError("")} />
                      {error}
                    </div>
                  }
                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    ref={(el) => { if (el) loginRefs.current[2] = el }}
                    className="rounded-lg shadow-sm cursor-pointer bg-primary text-primary-foreground text-center px-8 py-2 flex justify-center items-center disabled:opacity-70"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleLoginRefs(2)
                    }
                  >
                    {loading ? <Loader /> : "Sign In"}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    onClick={() => {
                      setIsLogin(false);
                      setError("");
                    }}
                    size="md"
                    variant="ghost"
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Sign up here
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-10 py-10">
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
                  <Input
                    ref={(el) => { if (el) loginRefs.current[0] = el }}
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    classNameForLabel="text-xl"
                    value={signupData.email}
                    onChange={(e) => handleChange(e, "signup")}
                    name="email"
                    label="Email"
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleLoginRefs(0)
                    }
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <Input
                      ref={(el) => { if (el) loginRefs.current[1] = el }}
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      classNameForLabel="text-xl"
                      value={signupData.password}
                      onChange={(e) => handleChange(e, "signup")}
                      name="password"
                      label="Password"
                      isPassword={true}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLoginRefs(1)
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <Input
                      ref={(el) => { if (el) loginRefs.current[2] = el }}
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      classNameForLabel="text-xl"
                      value={signupData.confirmPassword}
                      onChange={(e) => handleChange(e, "signup")}
                      name="confirmPassword"
                      label="Confirm Password"
                      isPassword={true}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLoginRefs(2)
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-y-4 mt-10">
                  {error &&
                    <div className="flex gap-2 items-center text-destructive-foreground border px-4 py-2 rounded bg-destructive">
                      <X className="h-4 w-4" onClick={() => setError("")} />
                      {error}
                    </div>
                  }

                  <Button
                    ref={(el) => { if (el) loginRefs.current[3] = el }}
                    variant="primary"
                    size="lg"
                    onClick={handleSignup}
                    disabled={loading}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleLoginRefs(3)
                    }
                  >
                    {loading ? <Loader /> : "Create Account"}
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    onClick={() => {
                      setIsLogin(true);
                      setError("");
                    }}
                    variant="ghost"
                    size="md"
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Sign in here
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-l h-full">
          <div className="text-start p-6">
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
              <FileText className="h-8 w-8" />
              Smart Resume
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
