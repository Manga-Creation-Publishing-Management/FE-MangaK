// Component StatusBadge: Hiển thị nhãn trạng thái với màu sắc tương ứng.
// Ví dụ: Đang xử lý (vàng), Đã duyệt (xanh), Từ chối (đỏ)...
export function StatusBadge({ status }) {
  // Mapping (ánh xạ) giữa mã trạng thái và class màu sắc (Tailwind)
  const styles = {
    'processing': 'bg-info/10 text-info border-info/30', // Xanh lam nhạt
    'rejected': 'bg-destructive/10 text-destructive border-destructive/30', // Đỏ nhạt
    'approved': 'bg-success/10 text-success border-success/30', // Xanh lá nhạt
    'pending': 'bg-warning/10 text-warning border-warning/30', // Vàng cam nhạt
    'publishing': 'bg-green-500 text-white border-green-500/30', // Xanh lá đậm (đang xuất bản)
    'cancelled': 'bg-red-500 text-white border-red-500/30' // Đỏ đậm (đã hủy)
  };

  // Mapping (ánh xạ) giữa mã trạng thái và tên hiển thị ra màn hình
  const labels = {
    'processing': 'Processing', // Đang xử lý
    'rejected': 'Rejected', // Bị từ chối
    'approved': 'Approved', // Đã duyệt
    'pending': 'Pending', // Đang chờ
    'publishing': 'Publishing', // Đang xuất bản
    'cancelled': 'Cancelled' // Đã hủy
  };

  // Lấy ra class màu tương ứng, nếu không có thì để chuỗi rỗng
  const currentStyle = styles[status] || '';
  
  // Lấy ra text hiển thị tương ứng, nếu không có thì in luôn giá trị status gốc
  const currentLabel = labels[status] || status;

  return (
    // Thẻ <span> có viền cong bo tròn hoàn toàn (rounded-full)
    // Tự động áp dụng class màu sắc lấy được ở trên
    <span className={`px-3 py-1 rounded-full border text-sm ${currentStyle}`}>
      {currentLabel}
    </span>
  );
}