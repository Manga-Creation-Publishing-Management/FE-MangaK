import { useEffect, useState } from "react";
import { Users, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { userService } from "@/services/userService.js";
import { apiRoleMap } from "../constants/adminConstants.js";

export function useAdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const [userListRes, readerListRes] = await Promise.all([
        userService.getUserList(),
        userService.getReaderList()
      ]);

      const systemList = Array.isArray(userListRes) ? userListRes : (userListRes.data || []);
      const readerList = Array.isArray(readerListRes) ? readerListRes : (readerListRes.data || []);

      const mappedSystem = systemList
        .map((user) => ({
          id: user.id || user.userId,
          role: apiRoleMap[user.role?.toLowerCase()] || user.role?.toLowerCase() || "mangaka",
          status: user.isActive === false || user.status?.toLowerCase() === 'suspended' || user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
        }))
        .filter((user) => user.role !== "admin");

      const mappedReaders = readerList.map((user) => ({
        id: user.id || user.userId,
        role: "reader",
        status: user.isActive === false || user.status?.toLowerCase() === 'suspended' || user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
      }));

      setUsers([...mappedSystem, ...mappedReaders]);
    } catch (error) {
      console.error('Failed to fetch user lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return {
    users,
    isLoading,
    stats,
    roleCounts,
    fetchUsers,
  };
}
