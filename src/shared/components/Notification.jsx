import { Mail } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { useNotification } from '@/features/auth/hooks/useNotification';

export function Notification({ notifications }) {
  const { notifications: hookNotifications } = useNotification();
  const displayNotifications = notifications ?? hookNotifications ?? [];
  const newCount = displayNotifications.filter(notif => notif.isNew).length;

  return (
    <div className="w-full mx-auto bg-card rounded-lg p-6 md:p-8 shadow border-accent border">
      <div className="flex items-center gap-3.5 mb-6 md:mb-8 pb-4 border-b border-border/50">
        <div className="text-accent flex items-center justify-center p-1">
          <Mail size={28} className="stroke-[2]" />
        </div>
        <h2 className="text-accent text-lg font-bold tracking-tight">
          Feedback Mailbox
        </h2>
        {newCount > 0 && (
          <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold tracking-wide animate-pulse">
            {newCount} new
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {displayNotifications.length > 0 ? (
          displayNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              sender={notif.sender}
              subject={notif.subject}
              message={notif.message}
              date={notif.date}
              hasIcon={notif.hasIcon}
              isNew={notif.isNew}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Mail size={48} className="mx-auto mb-3 opacity-30 stroke-[1.5]" />
            <p className="text-sm">No new feedback messages</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;
