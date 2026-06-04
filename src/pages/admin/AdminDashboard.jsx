import { useState } from "react";
import {
  Plus,
  Search,
  Users,
  ShieldCheck,
  UserX,
  UserCheck,
  X,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { WelcomeLine } from "../shared/WelcomeLine.jsx";
import { OverviewCard } from "../shared/OverviewCard.jsx";

const roleLabels = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
};

const roleColors = {
  mangaka: "bg-primary/10 text-primary border-primary/30",
  assistant: "bg-accent/10 text-accent border-accent/30",
  tantou: "bg-info/10 text-info border-info/30",
  editorial: "bg-success/10 text-success border-success/30",
};

const initialUsers = [
  {
    id: 1,
    name: "Akira Tanaka",
    email: "akira@comicmanager.com",
    phone: "+84 987 654 321",
    role: "mangaka",
    status: "active",
    createdAt: "2026-01-10",
  },
  {
    id: 2,
    name: "Yuki Sato",
    email: "yuki@comicmanager.com",
    phone: "+84 912 345 678",
    role: "mangaka",
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: 3,
    name: "Hiro Yamada",
    email: "hiro@comicmanager.com",
    phone: "+84 903 111 222",
    role: "mangaka",
    status: "suspended",
    createdAt: "2026-02-01",
  },
  {
    id: 4,
    name: "Mei Nakamura",
    email: "mei@comicmanager.com",
    phone: "+84 977 333 444",
    role: "assistant",
    status: "active",
    createdAt: "2026-01-20",
  },
  {
    id: 5,
    name: "Ryu Watanabe",
    email: "ryu@comicmanager.com",
    phone: "+84 966 555 666",
    role: "assistant",
    status: "active",
    createdAt: "2026-02-10",
  },
  {
    id: 6,
    name: "Sara Ito",
    email: "sara@comicmanager.com",
    phone: "+84 988 777 888",
    role: "assistant",
    status: "suspended",
    createdAt: "2026-03-05",
  },
  {
    id: 7,
    name: "Kenji Suzuki",
    email: "kenji@comicmanager.com",
    phone: "+84 901 888 999",
    role: "tantou",
    status: "active",
    createdAt: "2026-01-08",
  },
  {
    id: 8,
    name: "Aiko Matsuda",
    email: "aiko@comicmanager.com",
    phone: "+84 909 222 333",
    role: "editorial",
    status: "active",
    createdAt: "2026-01-05",
  },
];

export function AdminDashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Create account form state (Uses First Name & Last Name instead of Full Name)
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("mangaka");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [createError, setCreateError] = useState("");

  const stats = [
    {
      label: "Total Accounts",
      value: users.length,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Accounts",
      value: users.filter((u) => u.status === "active").length,
      icon: UserCheck,
      color: "bg-success/10 text-success",
    },
    {
      label: "Suspended",
      value: users.filter((u) => u.status === "suspended").length,
      icon: UserX,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Roles Assigned",
      value: 4,
      icon: ShieldCheck,
      color: "bg-info/10 text-info",
    },
  ];

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (user) => {
    const action = user.status === "active" ? "suspend" : "activate";
    setConfirmAction({ user, action });
  };

  const confirmToggle = () => {
    if (!confirmAction) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === confirmAction.user.id
          ? {
            ...u,
            status:
              confirmAction.action === "suspend" ? "suspended" : "active",
          }
          : u,
      ),
    );
    setConfirmAction(null);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    setNewPassword(
      Array.from(
        { length: 12 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join(""),
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (
      !newFirstName.trim() ||
      !newLastName.trim() ||
      !newEmail.trim() ||
      !newPhone.trim() ||
      !newPassword.trim()
    ) {
      setCreateError("All fields are required.");
      return;
    }
    if (users.some((u) => u.email === newEmail)) {
      setCreateError("Email already in use.");
      return;
    }
    const newUser = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: `${newFirstName.trim()} ${newLastName.trim()}`,
      email: newEmail.trim(),
      phone: newPhone.trim(),
      role: newRole,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setShowCreateModal(false);
    setNewFirstName("");
    setNewLastName("");
    setNewEmail("");
    setNewPhone("");
    setNewRole("mangaka");
    setNewPassword("");
    setCreateError("");
  };

  const handleRoleChange = (userId, role) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const permissionMatrix = {
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

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between top-align">
          <div>
            <WelcomeLine roleName="Admin" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPermissionsModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <ShieldCheck size={18} />
              Role Permissions
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus size={18} />
              Create Account
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <OverviewCard
                key={stat.label}
                iconName={<Icon size={24} />}
                iconColor={stat.color.includes("text-primary") ? "#3b82f6" : stat.color.includes("text-success") ? "#10b981" : stat.color.includes("text-destructive") ? "#ef4444" : "#06b6d4"}
                contentText={stat.label}
                valueNum={stat.value}
              />
            );
          })}
        </div>


        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Roles</option>
            <option value="mangaka">Mangaka</option>
            <option value="assistant">Assistant</option>
            <option value="tantou">Tantou Editor</option>
            <option value="editorial">Editorial Board</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* User Table */}
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Created At
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-muted/30 transition-colors ${user.status === "suspended" ? "opacity-60" : ""}`}
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
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-7 py-1 rounded-full border text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${roleColors[user.role]}`}
                        >
                          <option value="mangaka">Mangaka</option>
                          <option value="assistant">Assistant</option>
                          <option value="tantou">Tantou Editor</option>
                          <option value="editorial">Editorial Board</option>
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full border text-sm ${user.status === "active"
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                          }`}
                      >
                        {user.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
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
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Account Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2>Create Account</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number & Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="e.g. +84 987 654 321"
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@comicmanager.com"
                      className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="mangaka">Mangaka</option>
                    <option value="assistant">Assistant</option>
                    <option value="tantou">Tantou Editor</option>
                    <option value="editorial">Editorial Board</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    System Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Set a password"
                        className="w-full px-4 py-2.5 pr-10 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary font-mono"
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
                      className="px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors text-sm whitespace-nowrap"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    This password will be shared with the user at account
                    creation.
                  </p>
                </div>

                {createError && (
                  <p className="text-sm text-destructive">{createError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateError("");
                    }}
                    className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm Suspend/Activate Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-sm">
              <h2 className="mb-4">
                {confirmAction.action === "suspend"
                  ? "Suspend Account"
                  : "Activate Account"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {confirmAction.action === "suspend"
                  ? `Are you sure you want to suspend ${confirmAction.user.name}'s account? They will lose access immediately.`
                  : `Restore access for ${confirmAction.user.name}? They will be able to log in again.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggle}
                  className={`flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ${confirmAction.action === "suspend"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-success text-success-foreground"
                    }`}
                >
                  {confirmAction.action === "suspend" ? "Suspend" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Role Permissions Modal */}
        {showPermissionsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2>Role Permissions</h2>
                <button
                  onClick={() => setShowPermissionsModal(false)}
                  className="text-muted-foreground hover:text-foreground"
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
                          className="flex items-center gap-2 text-sm"
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
                  onClick={() => setShowPermissionsModal(false)}
                  className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
