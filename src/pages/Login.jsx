import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, Lock, Mail, User } from "lucide-react";
import Card from "../components/ui/Card";
import FormInput from "../components/forms/FormInput";

const roles = ["Chef", "Reviewer", "Manager", "CRA"];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Manager");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (!role) {
      setError("Please select a role.");
      return;
    }
    setError("");
    localStorage.setItem("ck_auth", "1");
    localStorage.setItem("ck_role", role);
    localStorage.setItem("ck_auth_email", email.trim());
    navigate("/", { replace: true });
  };

  // return (
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-b from-orange-500/10 via-orange-500/[0.02] to-transparent dark:from-orange-500/20">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-10 group cursor-default">
          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform duration-300">
            <ChefHat size={24} className="text-white" />
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--text)] tracking-tight">
              PBN Cloud Kitchen
            </div>
            <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-60">
              Admin Console
            </div>
          </div>
        </div>

        <Card className="p-6 sm:p-10 shadow-2xl shadow-black/5 dark:shadow-orange-500/5 backdrop-blur-xl bg-white/80 dark:bg-[var(--surface)]/80">
          <div className="text-2xl font-bold text-[var(--text)] mb-2 tracking-tight">
            Sign In
          </div>
          <div className="text-xs font-medium text-[var(--muted)] mb-8">
            Access the PBN Cloud Kitchen ecosystem with your credentials.
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pbnkitchen.com"
              type="email"
              icon={<Mail size={16} />}
              required
              name="email"
              autoComplete="email"
            />
            <FormInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              icon={<Lock size={16} />}
              required
              name="password"
              autoComplete="current-password"
            />

            <div className="space-y-2 relative">
              <label className="block text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest px-1">
                Account Role <span className="text-[var(--danger)]">*</span>
              </label>

              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`relative group cursor-pointer w-full pl-12 pr-4 py-3 text-sm font-bold bg-[var(--surface)] border-[2px] transition-all rounded-xl flex items-center justify-between ${
                  isDropdownOpen
                    ? "border-orange-500 ring-4 ring-orange-500/10 shadow-lg"
                    : "border-[var(--border)] hover:border-orange-500/50"
                }`}
              >
                <User
                  size={16}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDropdownOpen ? "text-orange-500" : "text-[var(--primary)]"}`}
                />
                <span className="text-[var(--text)]">
                  {role || "Select Role"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-orange-500" : "text-[var(--muted)]"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5">
                      {roles.map((r) => (
                        <div
                          key={r}
                          onClick={() => {
                            setRole(r);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors flex items-center justify-between ${
                            role === r
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                              : "text-[var(--text)] hover:bg-[var(--surface-hover)]"
                          }`}
                        >
                          {r}
                          {role === r && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full py-4 rounded-xl font-bold tracking-tight text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all mt-4 active:scale-95 bg-orange-500 uppercase"
            >
              Access Console
            </button>
          </form>
        </Card>

        <p className="mt-8 text-center text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest opacity-40">
          &copy; {new Date().getFullYear()} PBN KITCHEN TECHNOLOGIES
        </p>
      </div>
    </div>
  );
}
