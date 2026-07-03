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
} from "lucide-react";

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
      avatar: null,
    },
  });

  const avatarFile = watch("avatar");

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
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Image upload failed to Cloudinary");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        avatarUrl = cloudinaryData.secure_url;
      }

      const finalPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: avatarUrl,
      };

      console.log("Registration Data Ready for Backend:", finalPayload);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#121826] rounded-2xl border border-slate-200/60 dark:border-white/[0.05] p-6 sm:p-8 shadow-xl shadow-slate-200/30 dark:shadow-black/40 transition-all duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Join us today! Enter your details to set up your profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col items-center justify-center space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Profile Picture
          </label>
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-white/[0.15] group-hover:border-violet-500 transition-colors bg-slate-50 dark:bg-white/[0.02] flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="h-16 w-16 text-slate-300 dark:text-slate-600" />
              )}
            </div>

            <label className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                {...register("avatar")}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          {errors.avatar && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.avatar.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="John Doe"
              {...register("name")}
              className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm bg-slate-50/50 dark:bg-white/[0.02] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200
                ${
                  errors.name
                    ? "border-red-500 focus:ring-1 focus:ring-red-500/50"
                    : "border-slate-200 dark:border-white/[0.08] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
                }`}
            />
          </div>
          {errors.name && (
            <p className="text-xs font-medium text-red-500 mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 px-4 text-sm font-semibold text-white shadow-md shadow-violet-600/10 transition-all duration-200 hover:opacity-95 disabled:opacity-50 active:scale-[0.98] mt-4"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              Register <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <a
          href="#login"
          className="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default Register;
