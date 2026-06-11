import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Custom hook hỗ trợ việc quản lý danh sách truyện (Series Management)
export function useSeriesManagement() {
  // State kiểm soát việc đóng/mở popup Tạo truyện mới (CreateSeriesModal)
  const [showCreateSeriesModal, setShowCreateSeriesModal] = useState(false);
  
  // Biến cờ (flag) dùng để trigger (kích hoạt) useEffect fetch lại dữ liệu khi cần
  const [reload, setReload] = useState(false);

  // Hook dùng để điều hướng trang
  const navigate = useNavigate();

  // Hàm điều hướng đến trang Chi tiết truyện (Series Detail)
  // Gửi kèm tham số `role` qua location.state
  const handleNavigate = (role, seriesId) => {
    navigate(`/${role}/series/${seriesId}`, { state: { role } });
  }

  // Hàm điều hướng đến trang Chi tiết chương truyện (Chapter Detail)
  // Gửi kèm `role`, `seriesId`, `chapterId` qua location.state
  const handleNavigateToChapter = (role, seriesId, chapterId) => {
    navigate(`/${role}/chapter/${chapterId}`, { state: { role, seriesId, chapterId } });
  }

  // Đảo giá trị reload (từ true sang false hoặc ngược lại) 
  // Mục đích chỉ để giá trị thay đổi, làm các useEffect phụ thuộc vào `reload` chạy lại.
  const handleReload = () => {
    setReload(!reload);
  }

  // Mở hoặc đóng Modal tạo truyện mới
  const handleClick = () => {
    setShowCreateSeriesModal(!showCreateSeriesModal);
  }
  
  // Trả ra các hàm và biến trạng thái
  return {
    showCreateSeriesModal,
    reload,
    handleReload,
    handleClick,
    handleNavigate,
    handleNavigateToChapter
  };
}