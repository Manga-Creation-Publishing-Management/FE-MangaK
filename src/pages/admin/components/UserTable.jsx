import { UserX, UserCheck } from 'lucide-react';
import { CustomSelect } from '@/shared/components/CustomSelect.jsx';
import { roleColors, roleLabels } from '@/pages/admin/constants/adminConstants.js';

export function UserTable({
  isLoading,
  filteredUsers,
  onSupervisorChange,
  getSupervisorOptions,
  onToggleStatus,
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Supervisor
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No users match your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-muted/30 transition-colors ${user.status === "inactive" ? "opacity-60" : ""}`}
                >
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-sm font-medium ${roleColors[user.role] || ''}`}
                    >
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.role === 'mangaka' ? (
                      <CustomSelect
                        value={user.supervisorId || ""}
                        onChange={(val) => onSupervisorChange(user.id, val)}
                        className="w-full max-w-[180px]"
                        options={[
                          { value: "", label: "No Supervisor" },
                          ...getSupervisorOptions(user.supervisorId).map((t) => ({
                            value: t.userId || t.id,
                            label: `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email
                          }))
                        ]}
                      />
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full border text-sm ${user.status === "active"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-destructive/10 text-destructive border-destructive/30"
                        }`}
                    >
                      {user.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggleStatus(user)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${user.status === "active"
                        ? "text-destructive hover:bg-destructive/10 border border-destructive/30"
                        : "text-success hover:bg-success/10 border border-success/30"
                        }`}
                    >
                      {user.status === "active" ? (
                        <UserX size={15} />
                      ) : (
                        <UserCheck size={15} />
                      )}
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
