export const roleLabels = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  reader: "Reader",
};

export const roleColors = {
  mangaka: "bg-pink-400/10 text-pink-500 border-pink-300/50",
  assistant: "bg-accent/10 text-accent border-accent/30",
  tantou: "bg-info/10 text-info border-info/30",
  editorial: "bg-success/10 text-success border-success/30",
  reader: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  admin: "bg-rose-500/10 text-rose-500 border-rose-500/30",
};

export const apiRoleMap = {
  mangaka: "mangaka",
  assistant: "assistant",
  tantou: "tantou",
  editorial: "editorial",
  admin: "admin",
  reader: "reader",
};

export const feRoleToApiRole = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou",
  editorial: "Editorial",
  admin: "Admin",
  reader: "Reader",
};

export const permissionMatrix = {
  mangaka: [
    "Create series",
    "Manage own chapters",
    "Assign tasks to assistants",
    "View own feedback",
    "View leaderboard",
  ],
  assistant: [
    "View assigned tasks",
    "Update task progress",
    "View own income",
  ],
  tantou: [
    "Review assigned series",
    "Review chapters",
    "Send feedback to Mangaka",
    "Submit to Editorial Board",
    "View leaderboard",
  ],
  editorial: [
    "Approve/reject series",
    "Approve/reject chapters",
    "Manage publishing schedule",
    "Import rating data",
    "Cancel series",
    "View leaderboard",
  ],
};
