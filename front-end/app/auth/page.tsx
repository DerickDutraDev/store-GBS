import Link from "next/link"
import "../auth.css"

export default function AuthPage() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ alignItems: "center", display: "flex", flexDirection: "column" }}>
        <img
          src="/logo-store.jpg"
          alt="Logo Store GBS"
          style={{
            width: 90,
            height: 90,
            marginBottom: "1.2rem",
            background: "transparent",
            borderRadius: "1rem",
            boxShadow: "0 0 32px 0 oklch(0.55 0.22 25 / 0.10)",
            objectFit: "contain",
            mixBlendMode: "screen"
          }}
        />
        <h2 className="auth-title">
          Bem-vindo à Store<span style={{ color: "var(--accent)" }}>GBS</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
          <Link href="/login" className="auth-btn" style={{ textAlign: "center", textDecoration: "none" }}>
            Login
          </Link>
          <Link
            href="/register"
            className="auth-secondary-btn"
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  )
}