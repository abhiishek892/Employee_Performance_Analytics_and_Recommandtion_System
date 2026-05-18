import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import API from "../api";
import { useAuth } from "../hooks/useAuth";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup ? form : { email: form.email, password: form.password };
      const { data } = await API.post(endpoint, payload);
      login(data);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">AI Driven Full Stack Development</p>
        <h1>Employee Performance Analytics</h1>
        <p>Secure HR dashboard for employee records, performance ranking and AI-powered promotion or training recommendations.</p>
      </section>

      <form className="panel auth-card" onSubmit={handleSubmit}>
        <div className="section-heading">
          <h2>{isSignup ? "Create Admin Account" : "Admin Login"}</h2>
          <p>{isSignup ? "Signup stores the password in encrypted format." : "Login returns a JWT token for protected APIs."}</p>
        </div>

        {isSignup && (
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
        )}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength="6" required />
        </label>

        {message && <div className="alert error">{message}</div>}

        <button className="primary-button" disabled={loading}>
          {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
          {loading ? "Please wait..." : isSignup ? "Signup" : "Login"}
        </button>

        <p className="switch-auth">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Login" : "Signup"}</Link>
        </p>
      </form>
    </main>
  );
}
