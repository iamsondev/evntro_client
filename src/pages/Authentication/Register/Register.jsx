import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Lock,
  User,
  UserCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Camera,
  X,
  UserCheck,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "@/api/axiosInstance";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .trim()
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["attendee", "organizer"]).default("attendee"),
  avatar: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 2MB."
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  
  const { user, register: authRegister, login, authError, setAuthError } = useAuth();
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "attendee",
      avatar: null,
    },
  });

  const avatarFile = watch("avatar");
  const currentRole = watch("role");

  React.useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [avatarFile]);

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImagePreview(null);
    setValue("avatar", null);
  };

  const onSubmit = async (data) => {
    try {
      let avatarUrl = "";

      if (data.avatar && data.avatar.length > 0) {
        const file = data.avatar[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Failed to upload profile picture. Ensure cloud name is correct.");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        avatarUrl = cloudinaryData.secure_url;
      }

      // Backend registration action call
      const res = await authRegister(data.name, data.email, data.password, avatarUrl, data.role);
      if (res.success) {
        navigate("/dashboard");
      }
    } catch (error) {
      setAuthError(error.message || "Registration failed");
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
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Join the community and discover incredible events.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-2">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Profile Picture
          </label>
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-border bg-background/50 hover:border-primary transition-colors flex items-center justify-center shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="h-16 w-16 text-muted-foreground" />
              )}
            </div>

            <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setValue("avatar", e.target.files);
                }}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 p-1 bg-destructive hover:bg-destructive/90 text-white rounded-full shadow-md transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {errors.avatar && (
            <p className="text-xs font-medium text-destructive mt-1">
              {errors.avatar.message}
            </p>
          )}
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200
                ${
                  errors.name
                    ? "border-destructive focus:ring-4 focus:ring-destructive/10"
                    : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-destructive mt-1 pl-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200
                ${
                  errors.email
                    ? "border-destructive focus:ring-4 focus:ring-destructive/10"
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
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200
                ${
                  errors.password
                    ? "border-destructive focus:ring-4 focus:ring-destructive/10"
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

        {/* Role Selection Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
            Choose Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "attendee")}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  currentRole === "attendee"
                    ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "border-border bg-background/50 text-foreground hover:bg-secondary/40"
                }`}
            >
              <UserCheck className="h-4.5 w-4.5" />
              Attendee
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "organizer")}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  currentRole === "organizer"
                    ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "border-border bg-background/50 text-foreground hover:bg-secondary/40"
                }`}
            >
              <Briefcase className="h-4.5 w-4.5" />
              Organizer
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 py-3.5 px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <>
              Register <ArrowRight className="h-4.5 w-4.5" />
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
                  role: currentRole,
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

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
