import { Check, X } from "lucide-react";

// Component ApprovalPanel: Bảng điều khiển dùng để gửi nhận xét (Feedback) 
// và nút Phê duyệt / Từ chối (Approve / Reject) dành cho Tantou hoặc Editorial Board.
export function ApprovalPanel({
  feedback = "",            // Nội dung phản hồi (nếu có)
  onFeedbackChange,         // Hàm xử lý khi người dùng gõ vào ô feedback
  onApprove,                // Hàm xử lý khi người dùng nhấn nút Approve
  onReject,                 // Hàm xử lý khi người dùng nhấn nút Reject
  isLoading = false,        // Trạng thái đang tải (đang gọi API duyệt/từ chối)
  approveText = "Approve Names & Submit to Editorial Board", // Text mặc định cho nút Approve
  rejectText = "Reject Names & Send Feedback",               // Text mặc định cho nút Reject
}) {
  return (
    // Vỏ ngoài của bảng điều khiển, cách điệu với viền trên và shadow khi hover
    <div className="space-y-4 bg-card border-t border-border rounded-xl p-5 hover:shadow-lg">

      {/* Dòng chữ hướng dẫn cho người duyệt */}
      <p className="text-sm font-medium text-foreground">
        Feedback on Names/Chapter
        {/* Chú thích nhỏ: Feedback là không bắt buộc khi duyệt, nhưng bắt buộc khi từ chối */}
        <span className="text-muted-foreground font-normal ml-2">
          (Optional for approval, Required for rejection)
        </span>
      </p>

      {/* Ô nhập văn bản (Textarea) để viết nhận xét / phản hồi */}
      <textarea
        defaultValue={feedback}
        onChange={onFeedbackChange}
        rows={4} // Hiển thị sẵn 4 dòng
        placeholder="Provide feedback on the series concept and draft..."
        className="
      w-full px-4 py-3 resize-none 
      bg-muted rounded-lg
      border border-border
      text-foreground placeholder:text-muted-foreground
      focus:outline-none focus:ring-2 focus:ring-primary
      transition-colors
      "
      />

      {/* Khung chứa các nút bấm hành động (Approve & Reject) */}
      <div className="flex flex-wrap gap-3">
        
        {/* Nút Phê Duyệt (Approve) */}
        <button
          type="button"
          onClick={onApprove}
          disabled={isLoading} // Vô hiệu hóa khi đang load
          className="
            flex items-center gap-2 px-5 py-2.5 rounded-lg bg-success text-white font-semibold
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <Check size={16} strokeWidth={2.5} />
          {approveText}
        </button>

        {/* Nút Từ Chối (Reject) */}
        <button
          type="button"
          onClick={onReject}
          disabled={isLoading} // Vô hiệu hóa khi đang load
          className="
            flex items-center gap-2
            px-5 py-2.5 rounded-lg
            bg-destructive text-destructive-foreground font-semibold
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <X size={16} strokeWidth={2.5} />
          {rejectText}
        </button>
      </div>
    </div>
  );
}
