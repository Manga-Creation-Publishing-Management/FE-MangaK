import { useEffect, useState } from "react";
import { Users, ShieldCheck, UserX, UserCheck } from "lucide-react";
import { OverviewCard } from "@/shared/components/OverviewCard";
import { userService } from "../../services/userService.js";
import { mapApiRole, roleLabels } from "./constants/adminConstants.js";

const roleDotColors = {
  mangaka: "bg-pink-500",
  assistant: "bg-sky-500",
  tantou: "bg-indigo-500",
  editorial: "bg-emerald-500",
  reader: "bg-purple-500",
  admin: "bg-rose-500",
};

export function AdminDashboard() {
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

      const mappedSystem = systemList.map((user) => ({
        id: user.id || user.userId,
        role: mapApiRole(user.role),
        status: user.isActive === false || user.status?.toLowerCase() === 'suspended' || user.status?.toLowerCase() === 'inactive' ? 'inactive' : 'active',
      }));

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

  // Calculate user count for each role
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Overview Cards in a 2x2 grid wrapped in a card frame */}
          <div className="lg:col-span-6 bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground">General metrics and active status summary.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>

          {/* Right Column: Roles statistics table */}
          <div className="lg:col-span-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Role Distribution</h3>
                <p className="text-xs text-muted-foreground">Overview of users assigned to each system role.</p>
              </div>
              <div className="overflow-hidden border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
                    <tr>
                      <th className="px-6 py-3.5 text-left font-semibold">Role Name</th>
                      <th className="px-6 py-3.5 text-right font-semibold">User Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    {isLoading ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                          Loading statistics...
                        </td>
                      </tr>
                    ) : (
                      Object.entries(roleLabels).map(([roleKey, label]) => (
                        <tr key={roleKey} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${roleDotColors[roleKey] || 'bg-gray-500'}`} />
                            <span className="font-medium text-sm">{label}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold font-mono text-sm">
                            {roleCounts[roleKey] || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
