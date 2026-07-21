import { X } from "lucide-react";
import { roleColors, roleLabels, permissionMatrix } from "../constants/adminConstants.js";

export function RolePermissionsModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">Role Permissions</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(permissionMatrix).map(([role, perms]) => (
            <div
              key={role}
              className="border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full border text-sm font-medium ${roleColors[role]}`}
                >
                  {roleLabels[role]}
                </span>
              </div>
              <ul className="space-y-2">
                {perms.map((perm) => (
                  <li
                    key={perm}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
