import { useState } from "react";
import { useNavigate } from "react-router";
import { updateSeries } from "../../../services/updateSeriesService";

// Custom hook xử lý logic duyệt truyện (Phê duyệt hoặc Từ chối)
export function useUpdateSeries() {
  const [isLoading, setIsLoading] = useState(false); // Trạng thái đang gọi API
  const [feedback, setFeedback] = useState("");      // Nội dung phản hồi của người duyệt
  const navigate = useNavigate();                    // Hook điều hướng trang

  // --- Hàm Phê Duyệt Truyện (Approve) ---
  const handleApprove = async (id, roleFromState, currentStatus, setLocalStatus) => {
    // Ép chữ thường để dễ so sánh chuỗi
    const normalizedStatus = currentStatus?.toLowerCase();
    const normalizedRole = roleFromState?.toLowerCase();
    
    // Kiểm tra xem người dùng hiện tại có thuộc nhóm quyền tương ứng không
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";
    const isEditorial = normalizedRole === "editorial" || normalizedRole === "editorialboard";

    let newStatus;
    // Logic quy trình duyệt:
    // 1. Tantou duyệt -> Truyện chuyển từ "processing" (đang xử lý) thành "pending" (chờ Editorial duyệt tiếp)
    // 2. Editorial duyệt -> Truyện chuyển từ "pending" thành "approved" (đã được duyệt hoàn toàn)
    if (isTantou && normalizedStatus === "processing") {
      newStatus = "pending";
    } else if (isEditorial && normalizedStatus === "pending") {
      newStatus = "approved";
    } else {
      // Báo lỗi nếu trạng thái hiện tại không cho phép người này duyệt (bảo mật quy trình)
      alert("You cannot approve this series in its current state.");
      return;
    }

    setIsLoading(true);
    try {
      // Body payload gửi lên server
      const reviewPayload = {
        isApproved: true,
        note: feedback
      };

      // Tùy theo role mà gọi endpoint API tương ứng
      if (isTantou) {
        await updateSeries.updateToPending(id, reviewPayload);
      } else {
        await updateSeries.updateToApprove(id, reviewPayload);
      }

      // Cập nhật lại trạng thái local trên giao diện (tránh phải reload toàn trang)
      setLocalStatus(newStatus);
      alert(`Series has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
      
      // Chuyển hướng quay lại trang trước đó
      navigate(-1);
    } catch (error) {
      console.error("Error approving series:", error);
      alert("Failed to approve series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm Từ Chối Truyện (Reject) ---
  const handleReject = async (id, roleFromState, setLocalStatus) => {
    // Ràng buộc bắt buộc phải nhập lý do (feedback) khi từ chối
    if (!feedback.trim()) {
      alert("Please provide feedback before rejecting.");
      return;
    }

    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";

    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved: false, // Flag đánh dấu từ chối
        note: feedback
      };

      // Cả 2 role khi từ chối đều đẩy truyện về trạng thái "rejected", 
      // tùy từng backend config nhưng hàm gọi API tương tự như bước approve.
      if (isTantou) {
        await updateSeries.updateToPending(id, reviewPayload);
      } else {
        await updateSeries.updateToApprove(id, reviewPayload);
      }

      // Ghi đè trạng thái local thành "rejected"
      setLocalStatus("rejected");
      alert("Series has been rejected.");
      
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting series:", error);
      alert("Failed to reject series. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trả về các thuộc tính và hàm ra ngoài component
  return {
    isLoading,
    feedback,
    setFeedback,
    handleApprove,
    handleReject
  };
}
