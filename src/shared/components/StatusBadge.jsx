export function StatusBadge({ status }) {
  const styles = {
    'processing': 'bg-info/10 text-info border-info/30 dark:bg-info/20 dark:text-info dark:border-info/70',
    'rejected': 'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:text-destructive dark:border-destructive/70',
    'approved': 'bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success dark:border-success/70',
    'pending': 'bg-warning/10 text-warning border-warning/30 dark:bg-warning/20 dark:text-warning dark:border-warning/70',
    'publishing': 'bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success dark:border-success/70',
    'cancelled': 'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:text-destructive dark:border-destructive/70',
    'created': 'bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/30 dark:bg-sidebar-primary/20 dark:text-sidebar-primary dark:border-sidebar-primary/70',
    'available': 'bg-sky/10 text-sky border-sky/30 dark:bg-sky/20 dark:text-sky dark:border-sky/70',
    'revising': 'bg-gold/10 text-gold border-gold/30 dark:bg-gold/20 dark:text-gold dark:border-gold/70',
    'completed': 'bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success dark:border-success/70',
    'scheduled': 'bg-schedule/10 text-schedule border-schedule/30 dark:bg-schedule/20 dark:text-schedule dark:border-schedule/70',
    'unsatisfied': 'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20 dark:text-destructive dark:border-destructive/70',
    'paid': 'bg-success/15 text-success border-success/40 dark:bg-success/20 dark:text-emerald-300 dark:border-emerald-400/80',
  };

  const labels = {
    'processing': 'Processing',
    'rejected': 'Rejected',
    'approved': 'Approved',
    'pending': 'Pending',
    'publishing': 'Publishing',
    'cancelled': 'Cancelled',
    'created': 'Created',
    'available': 'Available',
    'revising': 'Revising',
    'completed': 'Completed',
    'scheduled': 'Scheduled',
    'unsatisfied': 'Unsatisfied',
    'paid': 'Paid',
  };

  const currentStyle = styles[status] || 'bg-muted/40 text-foreground border-border dark:text-slate-200 dark:border-slate-400/70';
  const currentLabel = labels[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');

  return (
    <span className={`px-3 py-1 rounded-full border text-xs font-medium ${currentStyle}`}>
      {currentLabel}
    </span>
  );
}
