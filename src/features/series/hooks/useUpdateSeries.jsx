import { useState } from "react";
import { useNavigate } from "react-router";
import { updateSeries } from "../../../services/updateSeriesService";
import { useToast } from "../../../shared/hooks/useToast";

// Custom hook xử lý logic duyệt truyện (Phê duyệt hoặc Từ chối)
export function useUpdateSeries() {
  const { showAlert } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Trạng thái đang gọi API
  const [feedback, setFeedback] = useState("");      // Nội dung phản hồi của người duyệt
  const navigate = useNavigate();                    // Hook điều hướng trang

  // --- Hàm Phê Duyệt Truyện (Approve) ---
  const handleApprove = async (id, roleFromState, currentStatus, setLocalStatus) => {
    // Ép chữ thường để dễ so sánh chuỗi
    const normalizedStatus = currentStatus?.toLowerCase();
    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou";
    const isEditorial = normalizedRole === "editorial";

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
      showAlert("You cannot approve this series in its current state.", "error");
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
      showAlert(`Series has been approved! New status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);

      // Chuyển hướng quay lại trang trước đó
      navigate(-1);
    } catch (error) {
      console.error("Error approving series:", error);
      showAlert("Failed to approve series. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm Từ Chối Truyện (Reject) ---
  const handleReject = async (id, roleFromState, setLocalStatus, overrideFeedback = null) => {
    //Ưu tiên lấy chữ truyền vào (để khi annotate không bị check nữa)
    const finalFeedback = overrideFeedback != null ? overrideFeedback : feedback;


    // Ràng buộc bắt buộc phải nhập lý do (feedback) khi từ chối
    if (!finalFeedback.trim()) {
      showAlert("Please provide feedback before rejecting.", "warning");
      return;
    }

    const normalizedRole = roleFromState?.toLowerCase();
    const isTantou = normalizedRole === "tantou" || normalizedRole === "tantoueditor";

    setIsLoading(true);
    try {
      const reviewPayload = {
        isApproved: false, // Flag đánh dấu từ chối
        note: finalFeedback
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
      showAlert("Series has been rejected.");

      navigate(-1);
    } catch (error) {
      console.error("Error rejecting series:", error);
      showAlert("Failed to reject series. Please try again.", "error");
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
