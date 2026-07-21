import { User, Mail, Phone, Save } from "lucide-react";

export function PersonalInfoForm({
  register,
  errors,
  role,
  isSaving,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Personal Information</h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstName" className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} />
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className={`w-full px-4 py-2 bg-input-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.firstName ? "border-destructive focus:ring-destructive" : "border-border"
            }`}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={16} />
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className={`w-full px-4 py-2 bg-input-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.lastName ? "border-destructive focus:ring-destructive" : "border-border"
            }`}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail size={16} />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled
            className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none opacity-60 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone size={16} />
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            {...register("phone")}
            className={`w-full px-4 py-2 bg-input-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? "border-destructive focus:ring-destructive" : "border-border"
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        {role === "mangaka" && (
          <div className="space-y-2">
            <label htmlFor="authorName" className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              Author Name
            </label>
            <input
              id="authorName"
              type="text"
              {...register("authorName")}
              className={`w-full px-4 py-2 bg-input-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.authorName ? "border-destructive focus:ring-destructive" : "border-border"
              }`}
            />
            {errors.authorName && (
              <p className="text-xs text-destructive mt-1">{errors.authorName.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm text-muted-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          {...register("bio")}
          className={`w-full px-4 py-2 bg-input-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none ${
            errors.bio ? "border-destructive focus:ring-destructive" : "border-border"
          }`}
        />
        {errors.bio && (
          <p className="text-xs text-destructive mt-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save size={18} />
          )}
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
