import { API_URL } from "./utility";

export async function verifyToken(token: string): Promise<boolean> {
  try {
    console.log("Verifying token:", token);
    const response = await fetch(`${API_URL}/auth/verifyToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    let result: any = null;
    try {
      result = await response.json();
    } catch (err) {
      console.error("Failed to parse verifyToken response:", err);
    }

    if (!response.ok) {
      console.log("Token verification failed:", result?.message);
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Token verification error:", error);
    localStorage.removeItem("token");
    return false;
  }
}

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
