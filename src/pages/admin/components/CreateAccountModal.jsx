import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Eye, EyeOff } from "lucide-react";
import { CustomSelect } from "../../../shared/components/CustomSelect.jsx";
import { createAccountSchema } from "../schemas/createAccountSchema.js";
import { userService } from "../../../services/userService.js";
import { feRoleToApiRole } from "../constants/adminConstants.js";

export function CreateAccountModal({ show, onClose, onCreated, tantouList }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [createError, setCreateError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(createAccountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      role: "editorial",
      authorName: "",
      supervisorId: "",
      password: ""
    }
  });

  const selectedRole = watch("role");

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    const newPass = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    setValue("password", newPass, { shouldValidate: true });
  };

  const handleClose = () => {
    setCreateError("");
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    setCreateError("");
    try {
      const apiRole = feRoleToApiRole[data.role] || "Mangaka";
      await userService.createUser(apiRole, {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        phone: data.phone ? data.phone.trim() : null,
        authorName: data.role === 'mangaka' ? data.authorName.trim() : null,
        supervisorId: data.role === 'mangaka' && data.supervisorId ? data.supervisorId : null,
        status: "Active",
      });

      reset();
      onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create user:", error);
      setCreateError(error.message || "Failed to create account. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-xl">Create Account</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName")}
                placeholder="First name"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                placeholder="Last name"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Phone Number
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="e.g. +84 987 654 321"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="email@comicmanager.com"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div className={`grid ${selectedRole === 'mangaka' ? 'grid-cols-1 sm:grid-cols-2 gap-4' : 'grid-cols-1'}`}>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "mangaka", label: "Mangaka" },
                      { value: "assistant", label: "Assistant" },
                      { value: "tantou", label: "Tantou Editor" },
                      { value: "editorial", label: "Editorial Board" }
                    ]}
                  />
                )}
              />
              {errors.role && <p className="text-xs text-destructive mt-1">{errors.role.message}</p>}
            </div>
            {selectedRole === 'mangaka' && (
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Author Name
                </label>
                <input
                  type="text"
                  {...register("authorName")}
                  placeholder="Pen Name"
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.authorName && <p className="text-xs text-destructive mt-1">{errors.authorName.message}</p>}
              </div>
            )}
          </div>

          {selectedRole === 'mangaka' && (
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Tantou Editor
              </label>
              <Controller
                name="supervisorId"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "", label: "Select Tantou Editor (Optional)" },
                      ...tantouList.map((t) => ({
                        value: t.userId || t.id,
                        label: `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email
                      }))
                    ]}
                  />
                )}
              />
              {errors.supervisorId && <p className="text-xs text-destructive mt-1">{errors.supervisorId.message}</p>}
            </div>
          )}

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              System Password
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Set a password"
                  className="w-full px-4 py-2.5 pr-10 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={generatePassword}
                className="px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs sm:text-sm whitespace-nowrap cursor-pointer"
              >
                Generate
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            <p className="text-xs text-muted-foreground mt-1.5">
              This password will be shared with the user at account creation.
            </p>
          </div>

          {createError && (
            <p className="text-sm text-destructive">{createError}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
