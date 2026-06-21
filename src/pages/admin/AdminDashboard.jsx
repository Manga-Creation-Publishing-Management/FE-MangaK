import { useEffect, useState } from "react";
import { Plus, Users, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { WelcomeLine } from "../shared/WelcomeLine.jsx";
import { OverviewCard } from "../shared/OverviewCard.jsx";
import { userService } from "../../services/userService.js";
import { useToast } from "../../shared/hooks/useToast";

import { mapApiRole } from "./constants/adminConstants.js";
import { UserFilters } from "./components/UserFilters.jsx";
import { UserTable } from "./components/UserTable.jsx";
import { CreateAccountModal } from "./components/CreateAccountModal.jsx";
import { ConfirmStatusModal } from "./components/ConfirmStatusModal.jsx";
import { RolePermissionsModal } from "./components/RolePermissionsModal.jsx";

export function AdminDashboard() {
  const { showAlert } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [tantouList, setTantouList] = useState([]);

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
        supervisorId: user.supervisorId || user.SupervisorId || null,
      }));

      setUsers(mapped);
    } catch (error) {
      console.error('Failed to fetch user list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTantouList = async () => {
    try {
      const response = await userService.getTantouList();
      const list = response.data || [];
      setTantouList(list);
    } catch (error) {
      console.error("Failed to fetch tantou list:", error);
    }
  };

  const handleSupervisorChange = async (userId, supervisorId) => {
    const val = supervisorId === "" ? null : supervisorId;
    try {
      const targetUser = users.find(u => u.id === userId);
      if (!targetUser) return;

      const apiStatus = targetUser.status === "active" ? "Active" : "Inactive";
      await userService.updateUserStatus(userId, apiStatus, val);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, supervisorId: val } : u
        )
      );
      showAlert("Cập nhật Tantou Editor thành công", "success");
      fetchTantouList();
    } catch (error) {
      console.error("Failed to update supervisor:", error);
      showAlert("Đã xảy ra lỗi khi cập nhật Tantou Editor. Vui lòng thử lại!", "error");
    }
  };

  const getSupervisorOptions = (userSupervisorId) => {
    const options = [...tantouList];
    if (userSupervisorId && !options.some(t => (t.userId || t.id) === userSupervisorId)) {
      const currentSupervisor = users.find(u => u.id === userSupervisorId);
      if (currentSupervisor) {
        options.push({
          userId: currentSupervisor.id,
          firstName: currentSupervisor.name.split(' ')[0] || '',
          lastName: currentSupervisor.name.split(' ').slice(1).join(' ') || '',
          email: currentSupervisor.email
        });
      }
    }
    return options;
  };

  useEffect(() => {
    fetchUsers();
    fetchTantouList();
  }, []);

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

  const handleToggleStatus = (user) => {
    const action = user.status === "active" ? "inactive" : "activate";
    setConfirmAction({ user, action });
  };

  const confirmToggle = async () => {
    if (!confirmAction) return;

    try {
      const apiStatus = confirmAction.action === "inactive" ? "Inactive" : "Active";
      await userService.updateUserStatus(confirmAction.user.id, apiStatus, confirmAction.user.supervisorId);

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
      showAlert("Đã xảy ra lỗi khi cập nhật trạng thái tài khoản. Vui lòng thử lại!", "error");
    } finally {
      setConfirmAction(null);
    }
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

        <div className="grid grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <OverviewCard
                key={stat.label}
                iconName={<Icon size={24} />}
                iconColor={
                  stat.color.includes("text-primary")
                    ? "#3b82f6"
                    : stat.color.includes("text-success")
                    ? "#10b981"
                    : stat.color.includes("text-destructive")
                    ? "#ef4444"
                    : "#06b6d4"
                }
                contentText={stat.label}
                valueNum={stat.value}
              />
            );
          })}
        </div>

        <UserFilters
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          filterRole={filterRole}
          onFilterRoleChange={setFilterRole}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
        />

        <UserTable
          isLoading={isLoading}
          filteredUsers={filtered}
          onSupervisorChange={handleSupervisorChange}
          getSupervisorOptions={getSupervisorOptions}
          onToggleStatus={handleToggleStatus}
        />

        <CreateAccountModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchUsers}
          tantouList={tantouList}
        />

        <ConfirmStatusModal
          confirmAction={confirmAction}
          onConfirm={confirmToggle}
          onCancel={() => setConfirmAction(null)}
        />

        <RolePermissionsModal
          show={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
        />
      </div>
    </div>
  );
}
