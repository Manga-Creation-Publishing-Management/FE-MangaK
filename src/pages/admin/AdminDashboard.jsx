import { OverviewCard } from "@/shared/components/OverviewCard";
import { useAdminDashboard } from "./hooks/useAdminDashboard";
import { RoleDistributionTable } from "./components/RoleDistributionTable";

export function AdminDashboard() {
  const { isLoading, stats, roleCounts } = useAdminDashboard();

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-6 bg-card border border-border rounded-xl p-6 space-y-4 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-bold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground">General metrics and active status summary.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 items-stretch">
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

          <div className="lg:col-span-6 h-full">
            <RoleDistributionTable roleCounts={roleCounts} isLoading={isLoading} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
