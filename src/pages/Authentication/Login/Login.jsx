import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/api/axiosInstance";

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const { user, login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMounted(true);
    setAuthError(null);
    if (user) {
      navigate("/dashboard");
    }
    return () => setAuthError(null);
  }, [setAuthError, user, navigate]);

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
      navigate("/dashboard");
    }
  };

  return (
    <div
      className={`relative w-full bg-card/90 backdrop-blur-xl rounded-3xl border border-border p-8 sm:p-10 shadow-2xl transition-all duration-700 ease-out transform ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {isGoogleLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 rounded-3xl flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-foreground">Verifying Google Account...</p>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Sign In
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back to the event experience hub.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {authError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-4 w-4 text-muted-foreground transition-colors" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200
                ${
                  errors.email
                    ? "border-destructive/80 focus:ring-4 focus:ring-destructive/10"
                    : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-destructive mt-1 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider font-sans">
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-4 w-4 text-muted-foreground transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200
                ${
                  errors.password
                    ? "border-destructive/80 focus:ring-4 focus:ring-destructive/10"
                    : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-muted-foreground/60 hover:text-primary transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-destructive mt-1 pl-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 py-3.5 px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              Sign In <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center gap-3">
        <div className="flex-1 h-[1px] bg-border" />
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Or Continue With
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      {/* Social Logins */}
      <div className="flex flex-col gap-3.5 justify-center items-center">
        <div className="w-full flex justify-center [&>iframe]:!w-full [&>div]:!w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setAuthError(null);
                setIsGoogleLoading(true);
                const response = await axiosInstance.post("/auth/google", {
                  credential: credentialResponse.credential,
                });
                if (response.data) {
                  await login(response.data);
                  navigate("/dashboard");
                }
              } catch (error) {
                console.error("Google login backend error:", error);
                const errMsg =
                  error.response?.data?.msg ||
                  error.response?.data?.message ||
                  "Google authorization failed";
                setAuthError(errMsg);
              } finally {
                setIsGoogleLoading(false);
              }
            }}
            onError={() => {
              console.error("Google authentication failed");
              setIsGoogleLoading(false);
              setAuthError("Google login failed. Please try again.");
            }}
            theme="outline"
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
