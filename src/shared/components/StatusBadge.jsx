export function StatusBadge({ status }) {
  const styles = {
    'processing': 'bg-info/10 text-info border-info/30',
    'rejected': 'bg-destructive/10 text-destructive border-destructive/30',
    'approved': 'bg-success/10 text-success border-success/30',
    'pending': 'bg-warning/10 text-warning border-warning/30',
    'publishing': 'bg-success/10 text-success border-success/30',
    'cancelled': 'bg-destructive/10 text-destructive border-destructive/30',
    'created': 'bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/30',
    'available': 'bg-sky/10 text-sky border-sky/30',
    'revising': 'bg-gold/10 text-gold border-gold/30',
    'completed': 'bg-success/10 text-success border-success/30',
    'scheduled': 'bg-schedule/10 text-schedule border-schedule/30',
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
    'scheduled': 'Scheduled'
  };

  const currentStyle = styles[status] || '';
  const currentLabel = labels[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full border text-sm ${currentStyle}`}>
      {currentLabel}
    </span>
  );
}
