import { useEffect, useState } from "react";
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
import { userService } from "../../services/userService.js";
import { CustomSelect } from "../../shared/components/CustomSelect.jsx";

// Hook form & Yup
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Định nghĩa nhãn hiển thị cho các quyền (roles) trên UI
const roleLabels = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  reader: "Reader",
  admin: "Administrator",
};

// Định nghĩa màu sắc hiển thị (Tailwind classes) cho các badge dựa trên quyền
const roleColors = {
  mangaka: "bg-pink-400/10 text-pink-500 border-pink-300/50",
  assistant: "bg-accent/10 text-accent border-accent/30",
  tantou: "bg-info/10 text-info border-info/30",
  editorial: "bg-success/10 text-success border-success/30",
  reader: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  admin: "bg-rose-500/10 text-rose-500 border-rose-500/30",
};

// Map role từ API về key nội bộ dùng trong FE
const mapApiRole = (role) => {
  const roleMap = {
    mangaka: "mangaka",
    assistant: "assistant",
    tantou: "tantou",
    editorial: "editorial",
    admin: "admin",
    reader: "reader",
  };
  return roleMap[role?.toLowerCase()] || role?.toLowerCase() || "mangaka";
};

// Map role key nội bộ FE sang giá trị API yêu cầu
const feRoleToApiRole = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou",
  editorial: "Editorial",
  admin: "Admin",
  reader: "Reader",
};

// Validation Schema với Yup cho form Tạo Tài Khoản
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  role: yup.string().required("Role is required"),
  authorName: yup.string().when("role", {
    is: "mangaka",
    then: (schema) => schema.required("Author name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Khởi tạo React Hook Form để thay thế quản lý state thủ công
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      role: "editorial",
      authorName: "",
      password: ""
    }
  });

  const selectedRole = watch("role");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [createError, setCreateError] = useState("");

  // ==================== GỌI API LẤY DANH SÁCH USER ====================
  const fetchUsers = async () => {
    try {
      const response = await userService.getUserList();
      const userList = Array.isArray(response) ? response : (response.data || []);

      const mapped = userList.map((user) => ({
        id: user.id || user.userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'N/A',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || '',
        role: mapApiRole(user.role),
        status: user.isActive === false || user.status?.toLowerCase() === 'suspended' || user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
      }));

      setUsers(mapped);
    } catch (error) {
      console.error('Failed to fetch user list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== THỐNG KÊ ====================
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
      label: "Inactive",
      value: users.filter((u) => u.status === "inactive").length,
      icon: UserX,
      color: "bg-destructive/10 text-destructive",
    },
    {
      label: "Roles Assigned",
      value: new Set(users.map((u) => u.role)).size,
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

  // Hàm xử lý mở popup xác nhận việc Khóa (Deactivate) hoặc Mở Khóa (Activate) tài khoản
  const handleToggleStatus = (user) => {
    const action = user.status === "active" ? "inactive" : "activate";
    setConfirmAction({ user, action });
  };

  // Hàm thực thi việc cập nhật trạng thái tài khoản sau khi người dùng xác nhận
  const confirmToggle = async () => {
    if (!confirmAction) return;
    
    try {
      const apiStatus = confirmAction.action === "inactive" ? "Inactive" : "Active";
      await userService.updateUserStatus(confirmAction.user.id, apiStatus);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === confirmAction.user.id
            ? {
              ...u,
              status: confirmAction.action === "inactive" ? "inactive" : "active",
            }
            : u,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái tài khoản. Vui lòng thử lại!");
    } finally {
      setConfirmAction(null);
    }
  };

  // Hàm tự động sinh mật khẩu ngẫu nhiên (12 ký tự) cho tài khoản mới
  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    const newPass = Array.from(
      { length: 12 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    // Gắn giá trị mới vào form và kích hoạt trigger để tắt báo lỗi nếu có
    setValue("password", newPass, { shouldValidate: true });
  };

  // Hàm xử lý hành động submit form Tạo mới tài khoản (gọi API)
  const onSubmit = async (data) => {
    setCreateError("");
    try {
      const apiRole = feRoleToApiRole[data.role] || "Mangaka";
      await userService.createUser(apiRole, {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        phone: data.phone.trim(),
        authorName: data.role === 'mangaka' ? data.authorName.trim() : null,
        status: "Active",
      });

      setShowCreateModal(false);
      reset(); // Reset form về trạng thái trống
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user:", error);
      setCreateError(error.message || "Failed to create account. Please try again.");
    }
  };

  // Ma trận định nghĩa các quyền (Permission) để hiển thị trong popup Role Permissions
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
    <div className="p-6 space-y-8">
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

        {/* Hiển thị các thẻ Thống Kê (OverviewCard) */}
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


        {/* Vùng bộ lọc: Tìm kiếm theo tên, Lọc theo Role, Lọc theo Trạng thái */}
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
          <div className="w-48">
            <CustomSelect
              value={filterRole}
              onChange={setFilterRole}
              options={[
                { value: "all", label: "All Roles" },
                { value: "mangaka", label: "Mangaka" },
                { value: "assistant", label: "Assistant" },
                { value: "tantou", label: "Tantou Editor" },
                { value: "editorial", label: "Editorial Board" },
                { value: "reader", label: "Reader" },
                { value: "admin", label: "Admin" }
              ]}
            />
          </div>
          <div className="w-40">
            <CustomSelect
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
            />
          </div>
        </div>

        {/* Bảng hiển thị danh sách người dùng (User Table) */}
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No users match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
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

        {/* Modal (Popup) Tạo tài khoản mới */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-xl">Create Account</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                    reset();
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
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

                {/* Row 2: Phone Number & Email */}
                <div className="grid grid-cols-2 gap-4">
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

                <div className={`grid ${selectedRole === 'mangaka' ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
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
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
                  <p className="text-xs text-muted-foreground mt-1.5">
                    This password will be shared with the user at account creation.
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
                      reset();
                    }}
                    className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận Khóa/Mở khóa tài khoản */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-8 w-full max-w-sm">
              <h2 className="mb-4">
                {confirmAction.action === "inactive"
                  ? "Deactivate Account"
                  : "Activate Account"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {confirmAction.action === "inactive"
                  ? `Are you sure you want to deactivate ${confirmAction.user.name}'s account? They will lose access immediately.`
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
                  className={`flex-1 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ${confirmAction.action === "inactive"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-success text-success-foreground"
                    }`}
                >
                  {confirmAction.action === "inactive" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal hiển thị chi tiết bảng quyền hạn của từng Role */}
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
