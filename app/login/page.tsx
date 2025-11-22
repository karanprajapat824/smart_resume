"use client";
import { useRef, useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { Button,Loader,Input } from "@/components/Ui";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa6";
import CircularGallery from '@/components/CircularGallery';
import TypingEffect from '@/components/TypingEffect';
import Popup from "@/components/Popup";
import { useAuth } from "../providers/AuthProvider";
import { useUtility } from "../providers/UtilityProvider";

export default function AuthPage() {
  const { accessToken, setAccessToken, loggedIn } = useAuth();
  const { API_URL } = useUtility();

  const [loginPage, setLoginPage] = useState(true);
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

  const message = [
    "Resumes That Demand Attention",
    "Make Your First Impression Unforgettable",
    "Your Dream Job Starts With the Right Design",
    "Templates That Work as Hard as You Do",
    "Because Average Resumes Don’t Get Noticed",
    "Build a Resume That Dominates the Stack",
    "Turn Recruiters’ Heads — Instantly",
    "Designs That Sell Your Story",
    "Confidence. Style. Results.",
    "Level Up Your Resume Game",
    "Stop Blending In — Start Standing Out",
    "Powerful Templates for Ambitious Professionals",
    "Be the Candidate They Remember",
    "Resumes That Speak Success",
    "Show Your Value Before You Even Speak"
  ];

  const [popup, setPopup] = useState<boolean>(false);

  const loginRefs = useRef<Array<HTMLInputElement | HTMLButtonElement | HTMLAnchorElement | null>>([]);

  function handleLoginRefs(index: number) {
    const nextInput = loginRefs.current[index + 1];
    if (nextInput) {
      nextInput.focus();
    } else {
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("error")) {
      const error = urlParams.get("error")?.replaceAll("_", " ") ?? "";
      setError(error);
    }
    else {
      // if(loggedIn) {
      //   setPopup(true);
      //   const redirectTo = localStorage.getItem("redirectAfterLogin");
      //   window.location.href = redirectTo || "/my-resumes";
      // }
    }
  }, []);

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
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      const accessToken = data.accessToken;
      if (!accessToken) {
        setError("No access token received");
        return;
      }

      setAccessToken(accessToken);

      const redirectTo = localStorage.getItem("redirectAfterLogin");
      window.location.href = redirectTo || "/my-resumes";

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

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed. Please try again later.");
        return;
      }

      const accessToken = data.accessToken;
      if (!accessToken) {
        setError("Signup succeeded but no access token received.");
        return;
      }

      setAccessToken(accessToken);

      const redirectTo = localStorage.getItem("redirectAfterLogin");
      window.location.href = redirectTo || "/templates";

    } catch (err) {
      console.error("Signup failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="h-screen flex items-center justify-center w-full">
      <Popup
        visible={popup}
        setVisible={setPopup}
        message={loginPage ? "Logged in successfully!" : "Account created successfully!"}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] place-items-center rounded lg:overflow-hidden items-center justify-center border md:h-[90%] md:w-[90%] h-[100%] w-full shadow-lg">
        <div className="bg-white hideScrollBar h-full pt-10 max-w-xl w-full">
          {loginPage ? (
            <div className="px-10 md:pt-6">
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
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="flex flex-col gap-y-4">
                  {error &&
                    <div className="flex gap-2 items-center text-destructive-foreground border px-4 py-2 rounded bg-destructive text-sm">
                      <X className="h-4 w-4 cursor-pointer" onClick={() => setError("")} />
                      {error}
                    </div>
                  }
                  <Button
                    onClick={handleLogin}
                    size="md"
                    disabled={loading}
                    ref={(el) => { if (el) loginRefs.current[2] = el }}
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
                      setLoginPage(false);
                      setError("");
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:underline font-medium cursor-pointer"
                  >
                    Sign up here
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-10 pt-6">
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
                    size="md"
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
                      setLoginPage(true);
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
          <div className="text-center font-semibold mb-2">Or With</div>
          <div className="px-6 py-2 pb-4 flex items-center justify-around">
            <Button
              size="md"
              variant="ghost"
              className="border border-muted-foreground w-[40%] rounded"
              icon={<FcGoogle />}
              href={`${API_URL}/auth/google`}
            >
              Google
            </Button>
            <Button
              size="md"
              variant="ghost"
              icon={<FaLinkedin />}
              className="border border-muted-foreground w-[40%] rounded"
              href={`${API_URL}/auth/linkedin`}
            >
              LinkedIn
            </Button>
          </div>
        </div>
        <div className="border-l h-full flex-col justify-between hidden lg:flex w-full">
          <div className="text-start p-6">
            <div className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
              <FileText className="h-8 w-8" />
              Smart Resume
            </div>
          </div>
          <div className="pb-8 text-3xl pl-8 font-semibold">
            <TypingEffect
              messages={message}
              loop={true}
              cursor={true}
              typingSpeed={40}
            />
          </div>
          <div className="h-100">
            <CircularGallery
              items={[
                { image: './resume1.jpg' },
                { image: './resume1.png' },
                { image: './resume2.jpg' },
                { image: './resume3.jpg' },
                { image: './resume4.png' },
                { image: './resume5.webp' },
                { image: './resume6.webp' },
                { image: './resume7.jpg' },
                { image: './resume8.webp' },
              ]}
              cardWidth={220}
              cardHeight={300}
              gap={80}
              radius={800}
              visibleCount={4}
              autoplayDps={8}
              wheelBehavior="none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
