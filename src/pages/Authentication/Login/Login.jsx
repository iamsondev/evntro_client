import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

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
    // Handle login logic here (e.g., API call)
    console.log("Login Data:", data);
    return new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay
  };

  return (
    <div className="w-full bg-white dark:bg-[#121826] rounded-2xl border border-slate-200/60 dark:border-white/[0.05] p-6 sm:p-8 shadow-xl shadow-slate-200/30 dark:shadow-black/40 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm bg-slate-50/50 dark:bg-white/[0.02] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.email
                    ? "border-red-500 focus:ring-1 focus:ring-red-500/50"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-xl border py-3 pl-11 pr-11 text-sm bg-slate-50/50 dark:bg-white/[0.02] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.password
                    ? "border-red-500 focus:ring-1 focus:ring-red-500/50"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-violet-600/10 transition-all duration-200 hover:opacity-95 disabled:opacity-50 active:scale-[0.98] mt-2"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Login <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer link to Register page */}
      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <a
          href="#register"
          className="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default Login;
