"use client";
import { Button, Loader, Input } from "@/components/Ui"
import { useState } from "react";
import Popup from "@/components/Popup";
import Header from "@/components/Header";
import { ArrowLeft } from "lucide-react";
import { useUtility } from "../providers/UtilityProvider";


export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const [section, setSection] = useState<number>(1);
    const [popup, setpopup] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [popupType, setPopupType] = useState<"success" | "error" | "warning" | "info">("error");
    const [loading, setLoading] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const { API_URL } = useUtility();

    const handleVerifyCode = async () => {
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/verifyCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, code: verificationCode })
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message || "Verification code verified successfully.");
            setPopupType("success");
            setpopup(true);
            setSection(3);
        } else {
            const data = await response.json();
            setMessage(data.message || "Failed to verify verification code.");
            setPopupType("error");
            setpopup(true);
        }
        setLoading(false);
    }

    const handleSendCode = async () => {
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/sendCode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message || "Verification code sent successfully.");
            setPopupType("success");
            setpopup(true);
            setSection(2);
        } else {
            const data = await response.json();
            setMessage(data.message || "Failed to send verification code.");
            setPopupType("error");
            setpopup(true);
        }
        setLoading(false);
    }

    function handleBackButton() {
        if (section === 1) window.location.href = "/login";
        else setSection(section - 1);
    }

    async function handleSetNewPassword() {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            setPopupType("error");
            setpopup(true);
            return;
        }
        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            setPopupType("error");
            setpopup(true);
            return;
        }
        setLoading(true);
        const response = await fetch(`${API_URL}/auth/resetPassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, newPassword })
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message || "Password reset successfully.");
            setPopupType("success");
            setpopup(true);
            window.location.href = "/login";
        } else {
            const data = await response.json();
            setMessage(data.message || "Failed to reset password.");
            setPopupType("error");
            setpopup(true);
        }
        setLoading(false);
    }

    return (
        <div>
            <Header
                items={["templates","login","create-my-resume"]}
                afterLoginRedirect="/login"
            />
            <Popup
                visible={popup}
                setVisible={setpopup}
                message={message}
                type={popupType}
            />
            <Button
                variant="ghost"
                className="absolute top-10 left-20 border"
                size="lg"
                icon={<ArrowLeft className="h-4 w-4" />}
                onClick={handleBackButton}
            >Go Back</Button>
            {
                section === 1 &&
                <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight text-center pt-10">Reset Your Password</h2>
                    <p className="text-2xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed text-center">
                        Enter your registered email address to receive a verification code.
                    </p>
                    <div className="w-1/2 flex flex-col gap-6">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            id="email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            size="sm"
                            variant="primaryPlus"
                            onClick={handleSendCode}
                            disabled={loading}
                        >
                            {loading ? <Loader /> : "Send Code"}
                        </Button>
                    </div>

                </div>
            }

            {
                section === 2 &&
                <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight text-center pt-10">Check Your Email</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed text-center">
                        We've sent a verification code to your <span className="font-semibold">{email}</span> email address. Please check your inbox and enter the code below.
                    </p>
                    <div className="w-1/2 flex flex-col gap-6">
                        <Input
                            type="text"
                            placeholder="Enter verification code"
                            id="verificationCode"
                            value={verificationCode}
                            name="verificationCode"
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <Button
                            size="sm"
                            variant="primaryPlus"
                            onClick={handleVerifyCode}
                            disabled={loading}
                        >
                            {loading ? <Loader /> : "Verify Code"}
                        </Button>
                    </div>
                </div>
            }

            {
                section === 3 &&
                <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6 leading-tight text-center pt-10">Set new password</h2>
                    <div className="w-1/2 flex flex-col gap-6">
                        <Input
                            type="text"
                            placeholder="Enter new password"
                            id="newPassword"
                            value={newPassword}
                            name="newPassword"
                            onChange={(e) => setNewPassword(e.target.value)}
                            isPassword={true}
                        />
                        <Input
                            type="text"
                            placeholder="Confirm new password"
                            id="confirmPassword"
                            value={confirmPassword}
                            name="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isPassword={true}
                        />
                        <Button
                            size="sm"
                            variant="primaryPlus"
                            onClick={handleSetNewPassword}
                            disabled={loading}
                        >
                            {loading ? <Loader /> : "Set New Password"}
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
}