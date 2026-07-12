import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router";

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMounted(true);
    setAuthError(null);
    return () => setAuthError(null);
  }, [setAuthError]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const response = await login(data.email, data.password);
    if (response.success) {
      navigate("/");
    }
  };

  return (
    <div
      className={`w-full bg-white/70 dark:bg-[#121826]/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/[0.06] p-8 sm:p-10 shadow-2xl shadow-slate-200/20 dark:shadow-black/60 transition-all duration-700 ease-out transform ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sign In
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Welcome back to the event experience hub.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-red-550 animation-pulse" />
          {authError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-slate-50/40 dark:bg-white/[0.01] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.email
                    ? "border-red-500/80 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-xl border py-3.5 pl-12 pr-12 text-sm bg-slate-50/40 dark:bg-white/[0.01] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.password
                    ? "border-red-500/80 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1 pl-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 dark:shadow-violet-600/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Sign In <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <hr className="w-full border-slate-200 dark:border-white/[0.08]" />
        <span className="absolute bg-white dark:bg-[#121826] px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-505">
          Or Continue With
        </span>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/20 dark:bg-white/[0.01] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] py-3 text-sm font-semibold text-slate-700 dark:text-[#A0AEC0] transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.44-2.885-6.44-6.44s2.885-6.44 6.44-6.44c1.633 0 3.12.607 4.269 1.603l3.24-3.24C19.23 2.14 15.938 1 12.24 1 5.48 1 0 6.48 0 13.24s5.48 12.24 12.24 12.24c6.76 0 12.24-5.48 12.24-12.24 0-.822-.093-1.614-.265-2.285h-11.98z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/20 dark:bg-white/[0.01] hover:bg-slate-100/50 dark:hover:bg-white/[0.03] py-3 text-sm font-semibold text-slate-700 dark:text-[#A0AEC0] transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          GitHub
        </button>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
