import { usePublishingSchedule } from '../../features/schedule/PublishingSchedule';
import { Calendar, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/pages/shared/StatusBadge';
import { OverviewCard } from '../shared/OverviewCard';
import { useState } from 'react';

export function PublishingSchedule() {

  // ==================== LẤY DỮ LIỆU TỪ CUSTOM HOOK ====================
  // Destructuring các state và handler từ usePublishingSchedule hook
  // Hook này đóng gói toàn bộ logic: gọi API, quản lý form, CRUD schedule
  const {
    showAddSchedule,       // boolean: Điều khiển hiển thị modal tạo/sửa schedule
    setShowAddSchedule,    // setter: Mở/đóng modal tạo/sửa
    selectedSeries,        // string: ID của series được chọn trong form
    setSelectedSeries,     // setter: Cập nhật series được chọn
    frequency,             // string: Tần suất xuất bản ('weekly' | 'monthly')
    setFrequency,          // setter: Cập nhật tần suất
    startDate,             // string: Ngày bắt đầu xuất bản (format YYYY-MM-DD)
    setStartDate,          // setter: Cập nhật ngày bắt đầu
    approvedSeries,        // array: Danh sách series đã duyệt (dùng cho dropdown)
    schedules,             // array: Danh sách tất cả schedule hiện có
    handleCreateSchedule,  // function: Xử lý tạo mới hoặc cập nhật schedule
    isEditing,             // boolean: Đang ở chế độ sửa (true) hay tạo mới (false)
    editingScheduleId,     // string|null: ID của schedule đang được sửa
    handleEditClick,       // function: Xử lý khi nhấn nút Edit trên 1 schedule
    handleDeleteConfirm,   // function: Xử lý xác nhận xóa schedule (gọi API)
    handleCloseModal,      // function: Đóng modal và reset form
  } = usePublishingSchedule();

  // ==================== STATE CỤC BỘ (LOCAL STATE) ====================
  // Các state này chỉ dùng trong component này, không nằm trong custom hook
  // vì modal xác nhận xóa là UI-only logic

  // showDeleteModal: Điều khiển hiển thị modal xác nhận xóa (true/false)
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // deleteScheduleId: Lưu ID của schedule sắp bị xóa
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);

  // deleteSeriesName: Lưu tên series để hiển thị trong modal xác nhận xóa
  const [deleteSeriesName, setDeleteSeriesName] = useState('');

  // ==================== HÀM XỬ LÝ SỰ KIỆN ====================

  // handleDeleteClick: Khi nhấn nút xóa (icon thùng rác) trên 1 schedule
  // -> Lưu thông tin schedule cần xóa và mở modal xác nhận
  const handleDeleteClick = (schedule) => {
    setDeleteScheduleId(schedule.id);
    setDeleteSeriesName(schedule.seriesName);
    setShowDeleteModal(true);
  };

  // handleConfirmDelete: Khi nhấn "Confirm Delete" trong modal xác nhận xóa
  // -> Gọi handler từ hook để xóa schedule qua API, rồi đóng modal và reset state
  const handleConfirmDelete = async () => {
    if (deleteScheduleId) {
      await handleDeleteConfirm(deleteScheduleId);
    }
    setShowDeleteModal(false);
    setDeleteScheduleId(null);
    setDeleteSeriesName('');
  };

  //Tính số lượng schedule trong tháng
  const now = new Date();
  const thisMonthReleases = schedules.filter((schedule) => {
    if (!schedule.startDate) return false;
    const date = new Date(schedule.startDate);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).length;

  // ==================== PHẦN RENDER (JSX) ====================
  return (
    <div className="p-9 space-y-8 animate-in fade-in duration-300">

      {/* ---------- HEADER: Tiêu đề + Nút tạo schedule ---------- */}
      <div className="flex justify-between items-start">
        {/* -- Tiêu đề trang và mô tả ngắn -- */}
        <div>
          <h1 className='font-medium text-2xl'>Publishing Schedule Management</h1>
          <p className="text-muted-foreground mt-1">Manage publication schedules for approved series</p>
        </div>

        {/* -- Nút "Create Schedule": Mở modal tạo lịch xuất bản mới -- */}
        <button
          onClick={() => setShowAddSchedule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Plus size={20} />
          Create Schedule
        </button>
      </div>

      {/* ---------- OVERVIEW CARDS: Thống kê tổng quan ---------- */}
      {/* Hiển thị 2 card: Số lượng phát hành tháng này + Tổng series đã lên lịch */}
      <div className="grid grid-cols-2 gap-6">
        <OverviewCard
          iconName={<Clock size={24} />}
          iconColor="#10b981"
          contentText="This Month Releases"
          valueNum={thisMonthReleases} //Mock
        />
        <OverviewCard
          iconName={<Calendar size={24} />}
          iconColor="#06b6d4"
          contentText="Total Series Scheduled"
          valueNum={schedules.length}
        />
      </div>


      {/* ---------- DANH SÁCH SCHEDULE HIỆN CÓ ---------- */}
      <div>
        <h2 className='text-xl font-semibold'>Current Schedules</h2>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (

          // ---- SCHEDULE CARD ----
          // Mỗi card hiển thị: tên series, tác giả, tần suất, ngày bắt đầu, nút Edit và Delete
          <div key={schedule.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">

              {/* -- Thông tin schedule (bên trái) -- */}
              <div className="flex-1">
                {/* Grid 3 cột hiển thị chi tiết schedule */}
                <div className="grid grid-cols-3 gap-6 mt-4">
                  <div>
                    <h3 className='text-lg font-semibold'>{schedule.seriesName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">by {schedule.author}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Frequency</p>
                    <p className="text-sm text-muted-foreground mt-1">{schedule.frequency}</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Publishing Date</p>
                    <p className="text-sm text-muted-foreground mt-1">{schedule.startDate}</p>
                  </div>
                </div>
              </div>

              {/* -- Các nút hành động (bên phải): Edit và Delete -- */}
              <div className="flex items-center gap-4">
                {/* Nút sửa schedule -> mở modal ở chế độ Edit */}
                <button
                  onClick={() => handleEditClick(schedule)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                  title="Edit Schedule"
                >
                  <Edit size={18} />
                </button>

                {/* Nút xóa schedule -> mở modal xác nhận xóa */}
                <button
                  onClick={() => handleDeleteClick(schedule)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Schedule"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== MODAL TẠO / SỬA SCHEDULE ==================== */}
      {/* Chỉ hiển thị khi showAddSchedule = true */}
      {/* Dùng chung cho cả 2 chế độ: Tạo mới (Create) và Chỉnh sửa (Update) */}
      {showAddSchedule && (
        // -- Overlay: Nền mờ đen phủ toàn màn hình --
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* -- Hộp thoại modal -- */}
          <div className="bg-card rounded-xl p-8 w-full max-w-2xl">

            {/* Tiêu đề modal: Thay đổi tùy chế độ (tạo mới / chỉnh sửa) */}
            <h2 className="mb-6">{isEditing ? 'Update Publishing Schedule' : 'Create Publishing Schedule'}</h2>

            {/* -- Form nhập liệu -- */}
            <div className="space-y-6 mb-6">

              {/* --- Chọn Series --- */}
              {/* Nếu đang sửa (isEditing): hiển thị input disabled (không cho đổi series) */}
              {/* Nếu đang tạo mới: hiển thị dropdown chọn series */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Select Series</label>
                {isEditing ? (
                  // Chế độ sửa: Hiển thị tên series dạng read-only
                  <input
                    type="text"
                    disabled
                    value={schedules.find(s => s.id === editingScheduleId)?.seriesName || ''}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border text-muted-foreground cursor-not-allowed focus:outline-none"
                  />
                ) : (
                  // Chế độ tạo mới: Dropdown chọn từ danh sách series đã duyệt
                  <select
                    value={selectedSeries}
                    onChange={(e) => setSelectedSeries(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a series...</option>
                    {/* Render danh sách series đã duyệt làm options */}
                    {approvedSeries.map((series) => (
                      <option key={series.id} value={series.id}>
                        {series.name} by {series.author}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* --- Chọn tần suất xuất bản (Weekly / Monthly) --- */}
              {/* Dùng 2 button thay vì radio button, button được chọn sẽ có viền highlight */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Publication Frequency</p>
                <div className="grid grid-cols-2 gap-4">
                  {/* Nút chọn "Weekly" */}
                  <button
                    onClick={() => setFrequency('weekly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${frequency === 'weekly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Weekly</p>
                    <p className="text-sm text-muted-foreground">New chapter every week</p>
                  </button>
                  {/* Nút chọn "Monthly" */}
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${frequency === 'monthly' ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                  >
                    <p className="font-medium">Monthly</p>
                    <p className="text-sm text-muted-foreground">New chapter every month</p>
                  </button>
                </div>
              </div>

              {/* --- Chọn ngày bắt đầu --- */}
              {/* min = ngày hôm nay -> không cho chọn ngày trong quá khứ */}
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* --- Ghi chú thông tin cho người dùng --- */}
              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm text-info">
                  The publishing schedule will determine when new chapters are automatically released to readers.
                  Make sure the mangaka has enough chapters ready before setting the start date.
                </p>
              </div>
            </div>

            {/* -- Các nút hành động của modal -- */}
            <div className="flex gap-3">
              {/* Nút "Cancel": Đóng modal và reset form */}
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {/* Nút "Create/Update Schedule": Gọi handler tạo hoặc cập nhật */}
              <button
                onClick={handleCreateSchedule}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isEditing ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL XÁC NHẬN XÓA SCHEDULE ==================== */}
      {/* Chỉ hiển thị khi showDeleteModal = true */}
      {/* Hỏi người dùng xác nhận trước khi xóa schedule */}
      {showDeleteModal && (
        // -- Overlay: Nền mờ đen phủ toàn màn hình --
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          {/* -- Hộp thoại modal -- */}
          <div className="bg-card rounded-xl p-8 w-full max-w-md">

            {/* Tiêu đề modal */}
            <h2 className="mb-4">Confirm Delete</h2>

            {/* Nội dung cảnh báo: hiển thị tên series sắp bị xóa schedule */}
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete the publishing schedule for <strong>{deleteSeriesName}</strong>? This action cannot be undone.
            </p>

            {/* -- Các nút hành động -- */}
            <div className="flex gap-3">
              {/* Nút "Cancel": Đóng modal xác nhận xóa và reset state */}
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteScheduleId(null);
                  setDeleteSeriesName('');
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {/* Nút "Confirm Delete": Xác nhận xóa schedule (gọi API) */}
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}