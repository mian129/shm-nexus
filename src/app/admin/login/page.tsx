"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminAuth", "true");
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "40px", height: "40px", background: "#FF6B00", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: "800", fontSize: "18px" }}>S</span>
          </div>
          <span style={{ fontSize: "20px", fontWeight: "700", color: "#1D2327" }}>
            SHM <span style={{ color: "#FF6B00" }}>Nexus</span>
          </span>
        </Link>
      </div>

      {/* Login Card */}
      <div style={{ width: "100%", maxWidth: "380px", background: "#fff", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #DCDCDC", padding: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1D2327", margin: "0 0 4px", textAlign: "center" }}>
          SHM Nexus
        </h1>
        <p style={{ fontSize: "14px", color: "#787C82", margin: "0 0 24px", textAlign: "center" }}>
          Log in to your account
        </p>

        {error && (
          <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "4px", marginBottom: "20px", fontSize: "13px", border: "1px solid #DC262633" }}>
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#1D2327", marginBottom: "6px" }}>
              Username or Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              placeholder="admin@shmnexus.com"
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#1D2327", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                style={{ paddingRight: "44px" }}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#787C82", padding: "4px" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#1D2327", cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#FF6B00" }} />
              Remember Me
            </label>
            <a href="#" style={{ fontSize: "13px", color: "#2271B1", textDecoration: "none" }}>
              Lost your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px 24px", background: loading ? "#787C82" : "#FF6B00",
              color: "#fff", border: "none", borderRadius: "4px", fontSize: "16px",
              fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p style={{ marginTop: "24px", fontSize: "12px", color: "#787C82" }}>
        Powered by{" "}
        <a href="/" style={{ color: "#FF6B00", textDecoration: "none" }}>
          SHM Nexus
        </a>
      </p>
    </div>
  );
}


