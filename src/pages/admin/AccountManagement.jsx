import { useEffect, useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { userService } from "../../services/userService.js";
import { useToast } from "@/shared/hooks/useToast";

import { mapApiRole } from "./constants/adminConstants.js";
import { UserFilters } from "./components/UserFilters.jsx";
import { UserTable } from "./components/UserTable.jsx";
import { CreateAccountModal } from "./components/CreateAccountModal.jsx";
import { ConfirmStatusModal } from "./components/ConfirmStatusModal.jsx";
import { RolePermissionsModal } from "./components/RolePermissionsModal.jsx";

export function AccountManagement() {
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
  const [accountType, setAccountType] = useState("system"); // "system" or "readers"

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = accountType === "system"
        ? await userService.getUserList()
        : await userService.getReaderList();
      const userList = Array.isArray(response) ? response : (response.data || []);

      const mapped = userList.map((user) => ({
        id: user.id || user.userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'N/A',
        email: user.email || '',
        phone: user.phoneNumber || user.phone || user.phone || '',
        role: accountType === "readers" ? "reader" : mapApiRole(user.role),
        status: user.isActive === false || user.status?.toLowerCase() === 'suspended' || user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
        supervisorId: user.supervisorId || user.SupervisorId || null,
      }));

      setUsers(mapped);
    } catch (error) {
      console.error('Failed to fetch user list:', error);
      setUsers([]);
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
      showAlert("Tantou Editor updated successfully", "success");
      fetchTantouList();
    } catch (error) {
      console.error("Failed to update supervisor:", error);
      showAlert("An error occurred while updating Tantou Editor. Please try again!", "error");
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

  // Fetch users when the account type tab changes
  useEffect(() => {
    fetchUsers();
    // Reset filters
    setSearchQuery("");
    setFilterRole("all");
    setFilterStatus("all");
  }, [accountType]);

  useEffect(() => {
    fetchTantouList();
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = accountType === "readers" || filterRole === "all" || u.role === filterRole;
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
      showAlert(
        confirmAction.action === "inactive"
          ? "Account deactivated successfully"
          : "Account activated successfully",
        "success"
      );
      fetchTantouList();
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      showAlert("An error occurred while updating account status. Please try again!", "error");
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Account Type Tabs */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setAccountType("system")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            accountType === "system"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          }`}
        >
          System Accounts
        </button>
        <button
          onClick={() => setAccountType("readers")}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            accountType === "readers"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
          }`}
        >
          Reader Accounts
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <UserFilters
              accountType={accountType}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              filterRole={filterRole}
              onFilterRoleChange={setFilterRole}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
            />
          </div>
          {accountType !== "readers" ? (
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setShowPermissionsModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <ShieldCheck size={18} />
                Role Permissions
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus size={18} />
                Create Account
              </button>
            </div>
          ) : (
            <div className="flex items-center text-xs text-muted-foreground italic bg-muted/30 px-3 py-2 rounded-lg border border-border shrink-0">
              Readers log in via Google authentication
            </div>
          )}
        </div>

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
          onCreated={() => {
            fetchUsers();
            fetchTantouList();
          }}
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
