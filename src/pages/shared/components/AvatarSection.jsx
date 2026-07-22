import { Camera } from "lucide-react";

export function AvatarSection({
  isLoading,
  avatarPreview,
  avatarUrl,
  watchedFirstName,
  watchedLastName,
  fileInputRef,
  handleFileChange,
  triggerFileInput,
  role,
}) {
  const roleLabels = {
    mangaka: "Mangaka",
    assistant: "Assistant",
    tantou: "Tantou Editor",
    editorial: "Editorial Board",
    admin: "Admin",
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            {avatarPreview || avatarUrl ? (
              <img
                src={avatarPreview || avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/40 p-0.5 border border-primary/50"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold ring-2 ring-primary/40 p-0.5 border border-primary/50">
                {watchedFirstName?.charAt(0) || ""}
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-md"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold text-card-foreground">{`${watchedFirstName || ""} ${watchedLastName || ""}`}</h2>
            <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
              <p className="text-muted-foreground">{roleLabels[role]}</p>
              <span className="inline-block px-3 py-0.5 bg-success/10 text-success border border-success/30 rounded-full text-sm font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
