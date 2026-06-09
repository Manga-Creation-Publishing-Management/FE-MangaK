export function StatusBadge({ status }) {
  const styles = {
    'processing': 'bg-info/10 text-info border-info/30',
    'rejected': 'bg-destructive/10 text-destructive border-destructive/30',
    'approved': 'bg-success/10 text-success border-success/30',
    'pending': 'bg-warning/10 text-warning border-warning/30',
    'publishing': 'bg-green-500 text-white border-green-500/30'
  };

  const labels = {
    'processing': 'Processing',
    'rejected': 'Rejected',
    'approved': 'Approved',
    'pending': 'Pending',
    'publishing': 'Publishing'
  };

  const currentStyle = styles[status] || '';
  const currentLabel = labels[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full border text-sm ${currentStyle}`}>
      {currentLabel}
    </span>
  );
}