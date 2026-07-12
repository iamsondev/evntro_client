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
    .refine((files) => files?.length === 1, "Profile picture is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 2MB.",
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  
  const { register: authRegister, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMounted(true);
    setAuthError(null);
    return () => setAuthError(null);
  }, [setAuthError]);

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
        navigate("/");
      }
    } catch (error) {
      setAuthError(error.message || "Registration failed");
    }
  };

  return (
    <div
      className={`w-full bg-white/70 dark:bg-[#121826]/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-white/[0.06] p-8 sm:p-10 shadow-2xl shadow-slate-200/20 dark:shadow-black/60 transition-all duration-700 ease-out transform ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Create Account
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Join the community and discover incredible events.
        </p>
      </div>

      {/* Error Alert */}
      {authError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-red-500" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Profile Picture
          </label>
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-250 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.01] hover:border-violet-500 transition-colors flex items-center justify-center shadow-inner">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="h-16 w-16 text-slate-350 dark:text-slate-650" />
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
                className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {errors.avatar && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.avatar.message}
            </p>
          )}
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-slate-50/40 dark:bg-white/[0.01] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.name
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-red-500 mt-1 pl-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-slate-50/40 dark:bg-white/[0.01] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.email
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
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
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-4 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm bg-slate-50/40 dark:bg-white/[0.01] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.password
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10"
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

        {/* Role Selection Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Choose Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "attendee")}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  currentRole === "attendee"
                    ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-md shadow-violet-500/5"
                    : "border-slate-200 dark:border-white/[0.08] bg-slate-50/20 dark:bg-white/[0.01] text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/[0.02]"
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
                    ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-md shadow-violet-500/5"
                    : "border-slate-200 dark:border-white/[0.08] bg-slate-50/20 dark:bg-white/[0.01] text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-white/[0.02]"
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
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-3.5 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 dark:shadow-violet-600/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none mt-4 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Register <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
