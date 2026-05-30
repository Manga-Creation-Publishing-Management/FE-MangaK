
export function StatusBadge({ status }) {
  const styles = {
    'need-review': 'bg-warning/10 text-warning border-warning/30',
    'processing': 'bg-info/10 text-info border-info/30',
    'rejected': 'bg-destructive/10 text-destructive border-destructive/30',
    'approved': 'bg-success/10 text-success border-success/30',
  };

  const labels = {
    'need-review': 'Need to Review',
    'processing': 'Processing',
    'rejected': 'Rejected',
    'approved': 'Approved',
  };

  return (
    <span className={`px-3 py-1 rounded-full border text-sm ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
