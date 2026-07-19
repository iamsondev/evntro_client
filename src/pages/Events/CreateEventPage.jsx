import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axiosInstance from "@/api/axiosInstance";
import {
  CalendarDays,
  MapPin,
  Users,
  FileText,
  Image,
  Tag,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  DollarSign,
} from "lucide-react";

const CATEGORIES = [
  "Conference",
  "Workshop",
  "Seminar",
  "Networking",
  "Concert",
  "Festival",
  "Sports",
  "Webinar",
  "Hackathon",
  "Exhibition",
  "Charity",
  "Other",
];

const InputField = ({ label, icon: Icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
      {label}
    </label>
    <div className="relative flex items-center">
      {Icon && (
        <Icon className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
      )}
      {children}
    </div>
    {error && (
      <p className="text-xs font-medium text-destructive pl-1">{error}</p>
    )}
  </div>
);

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerError, setBannerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: "",
      location: "",
      capacity: "",
      isFree: true,
      price: 0,
    },
  });

  const isFree = watch("isFree");

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setBannerError("Please upload a valid image file");
      return;
    }

    setBannerError(null);
    setBannerFile(file);

    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  const onSubmit = async (data) => {
    setServerError(null);

    if (!bannerFile) {
      setBannerError("Banner image is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", bannerFile);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "evntro",
      );

      const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dopurvmlr";

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!cloudinaryResponse.ok) {
        throw new Error(
          "Failed to upload banner image. Please try another image.",
        );
      }

      const cloudinaryData = await cloudinaryResponse.json();
      const bannerUrl = cloudinaryData.secure_url;

      const payload = {
        ...data,
        capacity: Number(data.capacity),
        isFree: !!data.isFree,
        price: data.isFree ? 0 : Number(data.price || 0),
        banner: bannerUrl,
      };

      const res = await axiosInstance.post("/events", payload);
      setSuccess(true);
      setTimeout(() => navigate(`/events/${res.data._id}`), 1500);
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.msg ||
        "Failed to create event. Please try again.";
      setServerError(msg);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200 ${
      hasError
        ? "border-destructive focus:ring-4 focus:ring-destructive/10"
        : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-semibold mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="bg-card border border-border/80 rounded-3xl p-8 sm:p-10 shadow-xl">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/20 mb-4">
              <CalendarDays className="h-3.5 w-3.5" /> Create New Event
            </span>
            <h1 className="text-3xl font-extrabold text-foreground">
              Event Details
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill in the details to publish your event on Evntro.
            </p>
          </div>

          {success && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-semibold text-sm">
              <CheckCircle className="h-5 w-5 shrink-0" />
              Event created! Redirecting you to the event page…
            </div>
          )}

          {serverError && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-semibold text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Banner Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
                Event Banner
              </label>

              {bannerPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-border/80 h-48 sm:h-56 group">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeBanner}
                    className="absolute top-3 right-3 rounded-full bg-black/60 hover:bg-black/80 text-white p-1.5 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="banner-upload"
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed h-48 sm:h-56 cursor-pointer transition-colors duration-200 ${
                    bannerError
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-border hover:border-primary/50 bg-background/50 hover:bg-primary/5"
                  }`}
                >
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground/80">
                    Click to upload banner image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </label>
              )}
              {bannerError && (
                <p className="text-xs font-medium text-destructive pl-1">
                  {bannerError}
                </p>
              )}
            </div>

            {/* Title */}
            <InputField
              label="Event Title"
              icon={FileText}
              error={errors.title?.message}
            >
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 5,
                    message: "Title must be at least 5 characters",
                  },
                })}
                placeholder="E.g. Global Tech Summit 2026"
                className={inputClass(!!errors.title)}
              />
            </InputField>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 20, message: "At least 20 characters" },
                })}
                rows={5}
                placeholder="Describe your event — what attendees can expect, speakers, agenda…"
                className={`w-full rounded-2xl border py-3.5 px-4 text-sm bg-background/50 text-foreground placeholder-muted-foreground/60 outline-none transition-all duration-200 resize-none ${errors.description ? "border-destructive focus:ring-4 focus:ring-destructive/10" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"}`}
              />
              {errors.description && (
                <p className="text-xs font-medium text-destructive pl-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
                Category
              </label>
              <div className="relative flex items-center">
                <Tag className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm bg-background/50 text-foreground outline-none transition-all duration-200 appearance-none cursor-pointer ${errors.category ? "border-destructive focus:ring-4 focus:ring-destructive/10" : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"}`}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-xs font-medium text-destructive pl-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Date & Time + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Date & Time"
                icon={CalendarDays}
                error={errors.date?.message}
              >
                <input
                  type="datetime-local"
                  {...register("date", { required: "Date is required" })}
                  className={inputClass(!!errors.date)}
                />
              </InputField>
              <InputField
                label="Location / Venue"
                icon={MapPin}
                error={errors.location?.message}
              >
                <input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  placeholder="E.g. BICC, Dhaka"
                  className={inputClass(!!errors.location)}
                />
              </InputField>
            </div>

            {/* Capacity */}
            <InputField
              label="Capacity (seats)"
              icon={Users}
              error={errors.capacity?.message}
            >
              <input
                type="number"
                min={1}
                {...register("capacity", {
                  required: "Capacity is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                placeholder="E.g. 500"
                className={inputClass(!!errors.capacity)}
              />
            </InputField>

            {/* Event Type / Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col justify-center p-4 rounded-2xl border border-border/80 bg-background/50 h-[72px]">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1 font-sans">
                      Event Type
                    </label>
                    <p className="text-[10px] text-muted-foreground pl-1">
                      Is this a free or paid event?
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold transition-colors duration-200 ${isFree ? "text-primary" : "text-muted-foreground"}`}
                    >
                      Free
                    </span>
                    <button
                      type="button"
                      onClick={() => setValue("isFree", !isFree)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        isFree ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isFree ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-xs font-semibold transition-colors duration-200 ${!isFree ? "text-primary" : "text-muted-foreground"}`}
                    >
                      Paid
                    </span>
                  </div>
                </div>
              </div>

              {!isFree && (
                <InputField
                  label="Ticket Price (USD)"
                  icon={DollarSign}
                  error={errors.price?.message}
                >
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price must be at least 0" },
                    })}
                    placeholder="E.g. 25.00"
                    className={inputClass(!!errors.price)}
                  />
                </InputField>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || success}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/95 py-4 px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Publishing…" : "Publish Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
