import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { StatusBadge } from '@/pages/shared/StatusBadge';
import { Link } from 'react-router';
import { WelcomeLine } from '../shared/WelcomeLine';
// Service gọi API lấy danh sách series
import { seriesService } from '../../services/seriesService';
// [TẠM ẨN] Service gọi API cập nhật trạng thái series (duyệt/huỷ) — chờ backend API huỷ series
// import { updateSeries } from '../../services/updateSeriesService';

export function EditorialDashboard() {

  // ==================== KHAI BÁO STATE ====================

  // showCancelModal: Điều khiển hiển thị modal xác nhận huỷ series (true/false)
  const [showCancelModal, setShowCancelModal] = useState(false);

  // selectedSeries: Lưu thông tin series đang được chọn để huỷ
  const [selectedSeries, setSelectedSeries] = useState(null);

  // cancelFeedback: Nội dung phản hồi/lý do khi huỷ series (bắt buộc nhập)
  const [cancelFeedback, setCancelFeedback] = useState('');

  // approvedSeries: Danh sách các series đã được duyệt hoặc đang xuất bản
  const [approvedSeries, setApprovedSeries] = useState([]);

  // isLoading: Trạng thái đang tải dữ liệu từ API (hiển thị loading text)
  const [isLoading, setIsLoading] = useState(true);

  // ==================== HÀM GỌI API ====================

  // fetchApprovedSeries: Lấy tất cả series từ API, lọc ra những series
  // có trạng thái "approved" hoặc "publishing", rồi map sang format hiển thị.
  const fetchApprovedSeries = async () => {
    try {
      // Gọi API lấy toàn bộ series
      const response = await seriesService.getAllSeries();
      const allSeries = response.data || [];

      // Lọc chỉ giữ lại series có status = 'approved' hoặc 'publishing'
      const filtered = allSeries.filter(
        (serie) => serie.status?.toLowerCase() === 'approved' || serie.status?.toLowerCase() === 'publishing'
      );

      // Chuyển đổi (map) dữ liệu API sang format dùng trong component
      const mapped = filtered.map((serie) => ({
        id: serie.seriesId,
        name: serie.title,
        author: serie.mangakaName,
        chapters: serie.totalChapters || 0,
        status: serie.status?.toLowerCase()
      }));

      // Cập nhật state với danh sách đã lọc và map
      setApprovedSeries(mapped);
    } catch (error) {
      console.error('Failed to fetch approved series:', error);
    } finally {
      // Dù thành công hay thất bại, tắt trạng thái loading
      setIsLoading(false);
    }
  };

  // ==================== SIDE EFFECT ====================

  // useEffect với dependency rỗng []: Chỉ chạy 1 lần khi component mount
  // để tải danh sách series từ API lần đầu tiên.
  useEffect(() => {
    fetchApprovedSeries();
  }, []);

  // ==================== HÀM XỬ LÝ SỰ KIỆN ====================

  // handleCancelClick: Khi nhấn nút "Cancel Series" trên 1 series card
  // -> Lưu series được chọn và mở modal xác nhận huỷ
  const handleCancelClick = (item) => {
    setSelectedSeries(item);
    setShowCancelModal(true);
  };

  // handleCancelConfirm: Khi nhấn "Confirm Cancel" trong modal
  // [TẠM ẨN] Chờ backend API hoàn thành để thêm logic gọi API huỷ series
  const handleCancelConfirm = () => {
    if (!cancelFeedback.trim()) {
      alert('Please provide feedback for cancellation');
      return;
    }
    // TODO: Gọi API huỷ series khi backend hoàn thành
    // await updateSeries.updateToApprove(selectedSeries.id, { isApproved: false, note: cancelFeedback });
    alert('Chức năng huỷ series chưa sẵn sàng — chờ backend API.');
    setShowCancelModal(false);
    setCancelFeedback('');
    setSelectedSeries(null);
  };

  // ==================== PHẦN RENDER (JSX) ====================
  return (
    <div className="p-6 space-y-8">

      {/* ---------- DÒNG CHÀO MỪNG ---------- */}
      {/* Hiển thị lời chào theo vai trò "Editorial Board" */}
      <WelcomeLine roleName="Editorial Board" />

      {/* ---------- TIÊU ĐỀ PHẦN DANH SÁCH ---------- */}
      <div>
        <h2 className='text-xl font-semibold ml-3'>Approved Series</h2>
      </div>

      {/* ---------- DANH SÁCH SERIES ĐÃ DUYỆT ---------- */}
      <div className="space-y-4">

        {/* 3 trạng thái hiển thị: Loading / Rỗng / Có dữ liệu */}
        {isLoading ? (
          // Trạng thái 1: Đang tải dữ liệu
          <p className="text-muted-foreground">Loading approved series...</p>
        ) : approvedSeries.length === 0 ? (
          // Trạng thái 2: Không có series nào
          <p className="text-muted-foreground">No approved series currently in publication.</p>
        ) : (
          // Trạng thái 3: Render danh sách series cards
          approvedSeries.map((item) => (
            // ---- SERIES CARD ----
            // Mỗi card hiển thị: tên, tác giả, số chapter, badge trạng thái, nút Cancel và nút View Details
            <div key={item.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">

                {/* -- Thông tin series (bên trái) -- */}
                <div className="flex-1">
                  <h3>{item.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">by {item.author}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.chapters} Chapters</p>
                </div>

                {/* -- Các nút hành động (bên phải) -- */}
                <div className="flex items-center gap-3">
                  {/* Badge hiển thị trạng thái (approved/publishing) */}
                  <StatusBadge status={item?.status.toLowerCase()} />

                  {/* Nút huỷ series -> mở modal xác nhận */}
                  <button
                    onClick={() => handleCancelClick(item)}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel Series
                  </button>

                  {/* Link xem chi tiết series -> điều hướng đến trang detail */}
                  <Link
                    to={`/editorialBoard/series/${item.id}`}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


      {/* ==================== MODAL XÁC NHẬN HUỶ SERIES ==================== */}
      {/* Chỉ hiển thị khi showCancelModal = true */}
      {showCancelModal && (
        // -- Overlay: Nền mờ đen phủ toàn màn hình --
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* -- Hộp thoại modal -- */}
          <div className="bg-card rounded-xl p-8 w-full max-w-md">

            {/* Tiêu đề modal */}
            <h2 className="mb-4 text-xl font-semibold">Cancel Series</h2>

            {/* Nội dung cảnh báo */}
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to cancel <strong>{selectedSeries?.name}</strong>? This action requires feedback.
            </p>

            {/* -- Ô nhập lý do huỷ (bắt buộc) -- */}
            <div className="mb-6">
              <label className="text-sm text-muted-foreground mb-2 block">
                Cancellation Feedback (Required)
              </label>
              <textarea
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                placeholder="Explain why this series is being cancelled..."
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-32 resize-none"
              />
            </div>

            {/* -- Các nút hành động -- */}
            <div className="flex gap-3">
              {/* Nút "Back": Đóng modal và reset state */}
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelFeedback('');
                  setSelectedSeries(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Back
              </button>

              {/* Nút "Confirm Cancel": Tạm thời chỉ hiển alert, chờ backend API */}
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
